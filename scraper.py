import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime, timedelta
import os
import re

URL = "https://playlegends.online/download.html"
HISTORY_FILE = "unique_history.json"
LAST_KILLS_FILE = "last_kills.json"

def parse_time_ago(text):
    """
    Parst Zeitangaben wie:
    - "4 mins ago"
    - "1 hour ago"
    - "2 hours ago"
    - "25 mins ago"
    - "1h ago" (optional)
    - "1 minute ago"
    Gibt Minuten als int zurück oder None.
    """
    text = text.strip().lower()
    # Muster: Zahl + (min|hour|hours?|h) + ago
    match = re.match(r"(\d+)\s*(min|hour|hours?|h)\s+ago", text)
    if not match:
        # Versuche ohne "ago" (falls vorhanden)
        match = re.match(r"(\d+)\s*(min|hour|hours?|h)", text)
    if not match:
        return None
    num = int(match.group(1))
    unit = match.group(2)
    if unit.startswith("min"):
        return num
    elif unit.startswith("hour") or unit == "h":
        return num * 60
    return None

def scrape_unique_kills():
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

def update_last_kills(kills, scraped_at_iso):
    """Aktualisiert die last_kills.json mit den Kill-Zeitpunkten."""
    if os.path.exists(LAST_KILLS_FILE):
        with open(LAST_KILLS_FILE, "r", encoding="utf-8") as f:
            last_kills = json.load(f)
    else:
        last_kills = {}

    scraped_at = datetime.fromisoformat(scraped_at_iso.replace("Z", "+00:00"))
    updated = 0

    for kill in kills:
        monster = kill["monster"]
        time_ago = kill["time_ago"]
        minutes = parse_time_ago(time_ago)
        if minutes is None:
            # Debug-Ausgabe im Workflow-Log
            print(f"⚠️ Konnte Zeitangabe nicht parsen: '{time_ago}' für {monster}")
            continue
        kill_time = scraped_at - timedelta(minutes=minutes)
        last_kills[monster] = kill_time.isoformat() + "Z"
        updated += 1

    with open(LAST_KILLS_FILE, "w", encoding="utf-8") as f:
        json.dump(last_kills, f, indent=2, ensure_ascii=False)

    print(f"ℹ️ {updated} von {len(kills)} Kills verarbeitet.")
    return last_kills

if __name__ == "__main__":
    data = scrape_unique_kills()
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ {data['total']} Einträge in {HISTORY_FILE} gespeichert")

    last_kills = update_last_kills(data["kills"], data["scraped_at"])
    print(f"✅ {len(last_kills)} Unique-Einträge in {LAST_KILLS_FILE} gespeichert")