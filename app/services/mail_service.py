"""
Send digest email via SMTP from Flask.
Recipient address always comes from Email Settings (DB), never from .env.
SMTP login in .env is only the sender account (Gmail, etc.).
"""

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import current_app


def smtp_configured() -> bool:
    cfg = current_app.config
    return bool(
        (cfg.get("MAIL_SERVER") or "").strip()
        and (cfg.get("MAIL_USERNAME") or "").strip()
        and (cfg.get("MAIL_PASSWORD") or "").strip()
    )


def send_digest_email(to_addr: str, subject: str, html_body: str, text_body: str) -> tuple[bool, str]:
    """
    Send HTML + plain text email. to_addr must be the DB recipient only.
    """
    cfg = current_app.config
    server = (cfg.get("MAIL_SERVER") or "").strip()
    port = int(cfg.get("MAIL_PORT", 587))
    user = (cfg.get("MAIL_USERNAME") or "").strip()
    password = (cfg.get("MAIL_PASSWORD") or "").strip()
    sender = (cfg.get("MAIL_DEFAULT_SENDER") or "").strip() or user

    to_addr = (to_addr or "").strip()
    if not to_addr:
        return False, "Empty recipient address"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_addr
    msg.attach(MIMEText(text_body or "", "plain", "utf-8"))
    msg.attach(MIMEText(html_body or "", "html", "utf-8"))

    use_tls = cfg.get("MAIL_USE_TLS", True)
    try:
        with smtplib.SMTP(server, port, timeout=45) as smtp:
            if use_tls:
                smtp.starttls()
            smtp.login(user, password)
            smtp.sendmail(sender, [to_addr], msg.as_string())
        return True, ""
    except Exception as e:
        return False, str(e)
