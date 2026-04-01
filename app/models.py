from datetime import datetime, date
from .extensions import db


class Source(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    url = db.Column(db.String(500), nullable=False, unique=True)
    category = db.Column(db.String(100), nullable=True)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    articles = db.relationship("Article", backref="source", lazy=True, cascade="all, delete-orphan")


class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source_id = db.Column(db.Integer, db.ForeignKey("source.id"), nullable=False)
    title = db.Column(db.String(500), nullable=False)
    url = db.Column(db.String(700), nullable=False, unique=True)
    content = db.Column(db.Text)
    published_at = db.Column(db.DateTime, nullable=True)
    summary = db.Column(db.Text)
    ai_category = db.Column(db.String(100))
    trend_score = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class DailyReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    report_date = db.Column(db.Date, default=date.today, unique=True)
    articles_count = db.Column(db.Integer, default=0)
    html_content = db.Column(db.Text)
    text_content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class EmailSetting(db.Model):
    """Stores recipient email for digest delivery; app uses the latest updated row."""

    __tablename__ = "email_setting"

    id = db.Column(db.Integer, primary_key=True)
    recipient_email = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
