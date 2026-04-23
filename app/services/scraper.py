import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from datetime import datetime

HEADERS = {
    "User-Agent": "Mozilla/5.0 (TechWatchAI Project)"
}


def fetch_html(url: str) -> str:
    response = requests.get(url, headers=HEADERS, timeout=15)
    response.raise_for_status()
    return response.text


def extract_articles_from_homepage(source_url: str, limit: int = 10):
    """
    Improved version:
    كتلقط روابط articles من بزاف ديال المواقع
    """
    try:
        html = fetch_html(source_url)
        soup = BeautifulSoup(html, "lxml")
    except Exception as e:
        print(f"Skipping {source_url} (fetch failed): {e}")
        return []

    found = []
    seen = set()

    keywords = [
        "/article",
        "/blog",
        "/news",
        "/post",
        "/story",
        "/ai",
        "/security",
        "/tech",
        "/science",
        "/information-technology"
    ]

    for a in soup.find_all("a", href=True):

        href = a.get("href", "").strip()
        title = a.get_text(" ", strip=True)

        if not href or not title or len(title) < 15:
            continue

        full_url = urljoin(source_url, href)

        if full_url in seen:
            continue

        link = full_url.lower()

        if any(word in link for word in keywords):

            seen.add(full_url)

            found.append({
                "title": title[:500],
                "url": full_url,
                "published_at": None
            })

        if len(found) >= limit:
            break

    return found


def extract_article_content(article_url: str) -> str:

    try:
        html = fetch_html(article_url)
        soup = BeautifulSoup(html, "lxml")

        article_tag = soup.find("article")

        if article_tag:
            text = article_tag.get_text(" ", strip=True)
            return text[:12000]

        paragraphs = soup.find_all("p")
        full_text = " ".join([p.get_text(" ", strip=True) for p in paragraphs])

        return full_text[:12000]

    except Exception as e:
        print("Article content error:", e)
        return ""


def estimate_trend_score(title: str, content: str) -> int:

    score = 0

    keywords = [
        "ai",
        "artificial intelligence",
        "chatgpt",
        "openai",
        "cybersecurity",
        "cloud",
        "python",
        "llm",
        "agent",
        "automation",
        "devops",
        "machine learning",
        "data"
    ]

    blob = f"{title} {content}".lower()

    for kw in keywords:
        if kw in blob:
            score += 10

    return min(score, 100)