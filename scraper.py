import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

URL = "https://playlegends.online/download.html"
OUTPUT = "unique_history.json"

def scrape():
    headers = {"User-Agent": "Mozilla/5.0"}
    resp = requests.get(URL, headers=headers, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    container = soup.select_one(".block.uniquekills")
    if not container:
        raise RuntimeError("Container .block.uniquekills nicht gefunden")
    
    entries = container.select(".discussions-content")
    kills = []
    for entry in entries:
        monster_tag = entry.select_one(".discussions-text")
        monster = monster_tag.get_text(strip=True) if monster_tag else ""
        killer_link = entry.select_one(".discussions-text-bt a")
        killer = killer_link.get_text(strip=True) if killer_link else ""
        killer_url = killer_link.get("href") if killer_link else ""
        time_span = entry.select_one(".discussions-text-bt")
        time_text = time_span.get_text(strip=True) if time_span else ""
        if "|" in time_text:
            time_ago = time_text.split("|")[-1].strip()
        else:
            time_ago = ""
        kills.append({
            "monster": monster,
            "killer": killer,
            "killer_url": killer_url,
            "time_ago": time_ago
        })
    return {
        "scraped_at": datetime.utcnow().isoformat() + "Z",
        "total": len(kills),
        "kills": kills
    }

if __name__ == "__main__":
    data = scrape()
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ {data['total']} Einträge gespeichert")