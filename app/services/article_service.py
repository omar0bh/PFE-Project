import time
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Article
from .scraper import extract_article_content, estimate_trend_score, extract_articles_from_homepage
from .ai_service import (
    summarize_article,
    classify_article,
    local_summary_fallback,
    local_category_fallback,
)


def normalize_article_url(url: str) -> str:
    """Stable URL for duplicate checks (same page often appears twice on homepages)."""
    if not url:
        return url
    u = url.strip()
    if len(u) > 1 and u.endswith("/"):
        u = u.rstrip("/")
    return u


def dedupe_scraped_items(items):
    """Keep first occurrence per URL so one batch cannot insert the same link twice."""
    seen = set()
    out = []
    for item in items:
        u = normalize_article_url(item.get("url", ""))
        if not u or u in seen:
            continue
        seen.add(u)
        row = dict(item)
        row["url"] = u
        out.append(row)
    return out


def find_existing_article(url: str):
    """Match stored URL with or without trailing slash (legacy rows)."""
    n = normalize_article_url(url)
    if not n:
        return None
    q = Article.query.filter_by(url=n).first()
    if q:
        return q
    return Article.query.filter_by(url=n + "/").first()


def process_and_save_article(source_id, item):
    """
    Processes a single scraped item: extracts content, gets AI summary/category,
    and saves to database if it doesn't exist.
    """
    url = normalize_article_url(item.get("url", ""))
    title = item.get("title", "")

    if not url:
        return None

    if find_existing_article(url):
        return None

    try:
        content = extract_article_content(url)

        if not content or len(content.strip()) < 120:
            return None

        try:
            summary = summarize_article(title, content)
        except Exception as e:
            print(f"Summary error for {url}: {e}")
            summary = local_summary_fallback(content)

        time.sleep(1)

        try:
            category = classify_article(title, content)
        except Exception as e:
            print(f"Category error for {url}: {e}")
            category = local_category_fallback(title, content)

        trend_score = estimate_trend_score(title, content)

        article = Article(
            source_id=source_id,
            title=title,
            url=url,
            content=content,
            summary=summary,
            ai_category=category,
            trend_score=trend_score,
        )

        try:
            with db.session.begin_nested():
                db.session.add(article)
                db.session.flush()
        except IntegrityError:
            # Duplicate URL vs DB or race; savepoint rolled back, session stays usable
            return None

        return article

    except Exception as e:
        print(f"Article processing error for {url}: {e}")
        return None

def scrape_and_process_source(source, limit=2):
    """Refactored logic to scrape a source and save its parsed articles."""
    scraped = extract_articles_from_homepage(source.url, limit=limit)
    scraped = dedupe_scraped_items(scraped)
    inserted = 0

    for item in scraped:
        article = process_and_save_article(source.id, item)
        if article:
            inserted += 1
            time.sleep(1)
            
    return inserted
