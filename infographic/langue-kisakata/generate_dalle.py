#!/usr/bin/env python3
"""Generate Kisakata infographic via OpenAI DALL-E 3 and save to output path."""
import os, sys, json, requests, time

OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")
if not OPENAI_KEY:
    print("ERROR: OPENAI_API_KEY not set")
    sys.exit(1)

OUTPUT_PATH = "/home/fortune/Projects/Sakata/public/infographies/langue-kisakata-bases.png"
PROMPT_FILE = "/home/fortune/Projects/Sakata/infographic/langue-kisakata/prompts/infographic.md"

with open(PROMPT_FILE) as f:
    full_prompt = f.read()

# Truncate to DALL-E limit (~4000 chars)
prompt = full_prompt[:3900]

print(f"Prompt length: {len(prompt)} chars")
print("Calling OpenAI DALL-E 3...")

resp = requests.post(
    "https://api.openai.com/v1/images/generations",
    headers={
        "Authorization": f"Bearer {OPENAI_KEY}",
        "Content-Type": "application/json",
    },
    json={
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": "1792x1024",
        "quality": "hd",
    },
    timeout=120,
)

if resp.status_code != 200:
    print(f"ERROR {resp.status_code}: {resp.text}")
    sys.exit(1)

data = resp.json()
image_url = data["data"][0]["url"]
revised_prompt = data["data"][0].get("revised_prompt", "")
print(f"Image URL: {image_url}")

# Download the image
print("Downloading image...")
img_resp = requests.get(image_url, timeout=60)
if img_resp.status_code != 200:
    print(f"Download failed: {img_resp.status_code}")
    sys.exit(1)

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
with open(OUTPUT_PATH, "wb") as f:
    f.write(img_resp.content)

print(f"Saved to: {OUTPUT_PATH}")
print(f"File size: {os.path.getsize(OUTPUT_PATH)} bytes")
print("DONE")
