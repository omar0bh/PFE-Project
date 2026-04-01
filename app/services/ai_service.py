import requests
from flask import current_app


def call_gemini(prompt: str) -> str:
    api_key = current_app.config["GEMINI_API_KEY"]
    model = current_app.config["GEMINI_MODEL"]
    base_url = current_app.config["GEMINI_BASE_URL"].rstrip("/")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is missing in .env")

    url = f"{base_url}/models/{model}:generateContent"

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    response = requests.post(
        url,
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        },
        json=payload,
        timeout=60
    )
    if response.status_code == 429:
        raise ValueError("Gemini API rate limit (429). Using fallback summary or category.")
    response.raise_for_status()

    data = response.json()

    try:
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except (KeyError, IndexError, TypeError):
        raise ValueError(f"Unexpected Gemini response: {data}")


def summarize_article(title: str, content: str) -> str:
    prompt = f"""
Tu es un assistant spécialisé en veille technologique.

Résume l'article suivant en français en 4 à 5 lignes maximum.
Le résumé doit être clair, professionnel et concis.

Titre: {title}

Contenu:
{content[:4000]}
"""
    return call_gemini(prompt)


def classify_article(title: str, content: str) -> str:
    prompt = f"""
Classe cet article dans UNE SEULE catégorie parmi la liste suivante :
AI, Cybersecurity, Web Development, Mobile, Cloud, Data, DevOps, Business Tech, Science, Technology, Other

Retourne uniquement le nom exact de la catégorie, sans explication.

Titre: {title}

Contenu:
{content[:3000]}
"""
    return call_gemini(prompt)


def local_summary_fallback(content: str) -> str:
    if not content:
        return "No summary available."

    text = content.strip().replace("\n", " ")
    sentences = text.split(". ")

    short_summary = ". ".join(sentences[:3]).strip()

    if not short_summary:
        return "No summary available."

    if not short_summary.endswith("."):
        short_summary += "."

    return short_summary[:500]


def local_category_fallback(title: str, content: str) -> str:
    blob = f"{title} {content}".lower()

    rules = {
        "AI": ["ai", "artificial intelligence", "llm", "chatgpt", "openai", "gemini", "machine learning"],
        "Cybersecurity": ["cybersecurity", "security", "hacker", "breach", "malware"],
        "Cloud": ["cloud", "aws", "azure", "gcp", "kubernetes"],
        "Data": ["data", "database", "analytics", "big data"],
        "DevOps": ["devops", "ci/cd", "docker", "deployment"],
        "Web Development": ["web", "frontend", "backend", "javascript", "react", "css", "html"],
        "Mobile": ["android", "ios", "mobile", "smartphone"],
        "Business Tech": ["startup", "enterprise", "business", "funding", "saas"],
        "Science": ["science", "biotech", "health", "research", "space"],
        "Technology": ["technology", "tech", "software", "hardware"]
    }

    for category, keywords in rules.items():
        if any(word in blob for word in keywords):
            return category

    return "Other"