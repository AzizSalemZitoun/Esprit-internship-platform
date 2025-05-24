from flask import Flask, request, jsonify
import wikipediaapi
import re
from flask_cors import CORS
app = Flask(__name__)
user_agent = 'stae-app (azizzat69@gmail.com)'
CORS(app)
wiki_wiki = wikipediaapi.Wikipedia(
    language='en',
    user_agent=user_agent
)

def extract_website_from_text(text):
    # Regex pour détecter une URL valide
    match = re.search(r"(https?://(?:www\.)?[^\s\"\'<>]+|www\.[^\s\"\'<>]+)", text)
    if match:
        return match.group(0).strip(".,()[]{}<>")
    return None

def extract_address(text):
    # Recherche basique de ligne contenant "headquartered in" ou similaire
    match = re.search(
        r"headquartered in ([A-Za-z ,]+)",
        text,
        re.IGNORECASE
    )
    if match:
        return match.group(1).strip()
    return None

def get_wikipedia_info(company_name):
    page = wiki_wiki.page(company_name)

    if not page.exists():
        return {}

    description = page.summary[:500]
    address = extract_address(page.text)

    # Tentative d'extraction automatique du site
    website = extract_website_from_text(page.text)

    # Fallback manuel pour certaines entreprises connues
    known_websites = {
        "microsoft": "https://www.microsoft.com",
        "apple": "https://www.apple.com",
        "google": "https://www.google.com",
        "facebook": "https://www.facebook.com",
        "amazon": "https://www.amazon.com",
        "tesla": "https://www.tesla.com"
    }

    if not website:
        website = known_websites.get(company_name.lower(), None)

    # Construction de l'URL du logo
    logo_url = ""
    if website:
        domain = website.replace("https://", "").replace("http://", "").split('/')[0]
        logo_url = f"https://logo.clearbit.com/{domain}"

    return {
        "nom": company_name,
        "description": description,
        "website": website or "Not found",
        "adress": address or "Not found",
        "logoUrl": logo_url
    }


@app.route("/ai-company-info", methods=["GET"])
def company_info():
    name = request.args.get("name")
    if not name:
        return jsonify({"error": "Missing company name"}), 400

    try:
        data = get_wikipedia_info(name)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
