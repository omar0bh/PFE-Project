import time
from datetime import date
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app, make_response
from .extensions import db
from .models import Source, Article, EmailSetting
from .services.scraper import extract_articles_from_homepage
from .services.digest_service import build_daily_digest
from .services.article_service import process_and_save_article, dedupe_scraped_items, scrape_and_process_source
from .services.mail_service import send_digest_email, smtp_configured

main_bp = Blueprint("main", __name__)

SCRAPE_ARTICLES_PER_SOURCE = 2


def check_internal_api_key(req):
    expected = current_app.config.get("INTERNAL_API_KEY")
    if not expected:
        # No key in .env: keep local/dev workflows working (do not lock out APIs).
        return True
    return req.headers.get("X-API-KEY") == expected


def get_current_recipient_email():
    """Recipient for digests: Email Settings page only (email_setting table). Not .env."""
    row = EmailSetting.query.order_by(EmailSetting.id.desc()).first()
    if row and row.recipient_email and row.recipient_email.strip():
        return row.recipient_email.strip()
    return None


def save_recipient_email(email: str):
    """Single source of truth: replace any previous rows so no stale address remains."""
    try:
        EmailSetting.query.delete()
        db.session.add(EmailSetting(recipient_email=email))
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise


@main_bp.route("/")
def dashboard():
    sources_count = Source.query.count()
    articles_count = Article.query.count()
    recent_articles = Article.query.order_by(Article.created_at.desc()).limit(4).all()
    current_email = get_current_recipient_email()

    from sqlalchemy import func
    category_counts = db.session.query(Article.ai_category, func.count(Article.id)).group_by(Article.ai_category).all()
    
    chart_labels = [c[0] or 'Uncategorized' for c in category_counts] if category_counts else []
    chart_values = [c[1] for c in category_counts] if category_counts else []

    return render_template(
        "dashboard.html",
        sources_count=sources_count,
        articles_count=articles_count,
        recent_articles=recent_articles,
        current_email=current_email,
        chart_labels=chart_labels,
        chart_values=chart_values
    )


@main_bp.route("/request-summary")
def request_summary_redirect():
    return redirect(url_for("main.email_settings"), code=301)


@main_bp.route("/email-settings", methods=["GET", "POST"])
def email_settings():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        if not email:
            flash("Please enter a valid email address.", "danger")
            return redirect(url_for("main.email_settings"))
        try:
            save_recipient_email(email)
        except Exception:
            flash("Could not save email. Check the database and try again.", "danger")
            return redirect(url_for("main.email_settings"))
        flash("Recipient email saved successfully.", "success")
        return redirect(url_for("main.email_settings"))

    current_email = get_current_recipient_email() or ""
    return render_template("email_settings.html", current_email=current_email)


@main_bp.route("/sources", methods=["GET", "POST"])
def sources():
    if request.method == "POST":
        name = request.form["name"]
        url = request.form["url"]
        category = request.form.get("category", "").strip() or None

        source = Source(name=name, url=url, category=category, active=True)
        db.session.add(source)
        db.session.commit()

        flash("Source added successfully", "success")
        return redirect(url_for("main.sources"))

    all_sources = Source.query.order_by(Source.created_at.desc()).all()
    return render_template("sources.html", sources=all_sources)


@main_bp.route("/sources/<int:source_id>/delete", methods=["POST"])
def delete_source(source_id):
    source = Source.query.get_or_404(source_id)
    db.session.delete(source)
    db.session.commit()
    flash("Source deleted", "success")
    return redirect(url_for("main.sources"))


@main_bp.route("/articles")
def articles():
    all_articles = Article.query.order_by(Article.created_at.desc()).all()
    return render_template("articles.html", articles=all_articles)


@main_bp.route("/scrape/<int:source_id>", methods=["POST"])
def scrape_source(source_id):
    source = Source.query.get_or_404(source_id)

    try:
        inserted = scrape_and_process_source(source, limit=SCRAPE_ARTICLES_PER_SOURCE)

        db.session.commit()
        flash(f"{inserted} new articles added from {source.name}", "success")

    except Exception as e:
        db.session.rollback()
        print(f"Scraping failed for {source.name}: {e}")
        flash(f"Scraping failed for {source.name}: {str(e)}", "danger")

    return redirect(url_for("main.sources"))


@main_bp.route("/api/sources", methods=["GET"])
def api_sources():
    if not check_internal_api_key(request):
        return jsonify({"error": "Unauthorized"}), 401

    rows = Source.query.filter_by(active=True).order_by(Source.created_at.asc()).all()
    return jsonify(
        [
            {
                "id": s.id,
                "name": s.name,
                "url": s.url,
                "category": s.category,
                "active": s.active,
            }
            for s in rows
        ]
    )


@main_bp.route("/api/email-settings", methods=["GET"])
def api_email_settings():
    if not check_internal_api_key(request):
        return jsonify({"error": "Unauthorized"}), 401

    email = get_current_recipient_email()
    return jsonify({"recipient_email": email})


@main_bp.route("/api/cron/run-daily", methods=["POST"])
def run_daily_cron():
    if not check_internal_api_key(request):
        return jsonify({"error": "Unauthorized"}), 401

    target_email = get_current_recipient_email() or ""
    active_sources = Source.query.filter_by(active=True).all()
    inserted = 0

    for source in active_sources:
        try:
            inserted += scrape_and_process_source(source, limit=SCRAPE_ARTICLES_PER_SOURCE)
        except Exception as e:
            print(f"Error processing source {source.name}: {e}")
            continue

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise

    digest = build_daily_digest()

    payload = {
        "status": "success",
        "recipient_email": target_email,
        "email": target_email,
        "inserted_articles": inserted,
        "articles_count": digest["articles_count"],
        "html_digest": digest["html"],
        "text_digest": digest["text"],
        "articles": digest["articles"],
        "email_sent": False,
        "email_error": None,
    }
    
    resp = make_response(jsonify(payload))
    resp.headers["X-TechWatch-Recipient"] = target_email
    return resp
