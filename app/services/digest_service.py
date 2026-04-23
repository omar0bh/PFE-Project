from datetime import date, datetime, timedelta
from app.models import Article, DailyReport
from app.extensions import db

def build_daily_digest():
    today = date.today()
    twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)

    articles = (
        Article.query
        .filter(Article.created_at >= twenty_four_hours_ago)
        .order_by(Article.trend_score.desc(), Article.created_at.desc())
        .all()
    )

    if not articles:
        return {
            "articles_count": 0,
            "html": "<h3>No new articles today</h3>",
            "text": "No new articles today",
            "articles": []
        }

    lines_text = []
    cards_html = []

    for art in articles:
        lines_text.append(
            f"- {art.title}\n  Category: {art.ai_category or 'N/A'}\n  Summary: {art.summary or 'No summary'}\n  URL: {art.url}\n"
        )

        cards_html.append(f"""
        <div style="margin-bottom:20px;padding:12px;border:1px solid #ddd;border-radius:8px;">
            <h4>{art.title}</h4>
            <p><strong>Source:</strong> {art.source.name}</p>
            <p><strong>Category:</strong> {art.ai_category or 'N/A'}</p>
            <p><strong>Trend score:</strong> {art.trend_score}</p>
            <p>{art.summary or 'No summary available'}</p>
            <a href="{art.url}">Read article</a>
        </div>
        """)

    html = f"""
    <h2>TechWatch AI - Daily Digest</h2>
    <p><strong>Date:</strong> {today}</p>
    <p><strong>Total articles:</strong> {len(articles)}</p>
    {''.join(cards_html)}
    """

    text = f"TechWatch AI - Daily Digest\nDate: {today}\nTotal articles: {len(articles)}\n\n" + "\n".join(lines_text)

    report = DailyReport.query.filter_by(report_date=today).first()
    if not report:
        report = DailyReport(report_date=today)
        db.session.add(report)

    report.articles_count = len(articles)
    report.html_content = html
    report.text_content = text
    db.session.commit()

    return {
        "articles_count": len(articles),
        "html": html,
        "text": text,
        "articles": [
            {
                "title": a.title,
                "category": a.ai_category,
                "summary": a.summary,
                "url": a.url,
                "trend_score": a.trend_score,
                "source": a.source.name
            }
            for a in articles
        ]
    }