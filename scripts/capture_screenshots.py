"""
Capture high-resolution screenshots for all key command centre views.
Uses Chrome headless to render and capture PNG screenshots.
"""

import os
import time
import subprocess

OUTPUT_DIR = r"c:\Users\mohan\Downloads\Rajasthan Royals Cricket Analytics War Room\docs\screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_URL = "http://localhost:5173"

views = [
    ("overview", f"{BASE_URL}/#overview", 1440, 900, "overview_landing.png"),
    ("batting", f"{BASE_URL}/#batting", 1440, 900, "batting_lab.png"),
    ("bowling", f"{BASE_URL}/#bowling", 1440, 900, "bowling_lab.png"),
    ("explorer", f"{BASE_URL}/#explorer", 1440, 900, "pressure_explorer.png"),
    ("compare", f"{BASE_URL}/#compare", 1440, 900, "player_comparison.png"),
    ("auction", f"{BASE_URL}/#auction", 1440, 900, "auction_war_room.png"),
    ("methodology", f"{BASE_URL}/#methodology", 1440, 900, "methodology_evidence.png"),
    ("mobile", f"{BASE_URL}/#overview", 390, 844, "responsive_mobile_390.png"),
    ("tablet", f"{BASE_URL}/#overview", 1024, 768, "responsive_tablet_1024.png"),
]

for name, url, width, height, fname in views:
    out_path = os.path.join(OUTPUT_DIR, fname)
    print(f"Capturing {name} ({width}x{height}) -> {fname}...")
    cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--screenshot={out_path}",
        f"--window-size={width},{height}",
        "--virtual-time-budget=4000",
        "--hide-scrollbars",
        url
    ]
    try:
        subprocess.run(cmd, check=True, timeout=15)
        if os.path.exists(out_path):
            print(f"✓ Saved: {fname} ({os.path.getsize(out_path) / 1024:.1f} KB)")
        else:
            print(f"✗ Failed to create: {fname}")
    except Exception as e:
        print(f"Error capturing {name}: {e}")

print("Screenshot capture complete!")
