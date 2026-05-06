#!/usr/bin/env python3
"""Génère des images uniques pour chaque article Sakata via GPT Image 1 (OpenAI)
et les upload sur Supabase Storage."""

import os, sys, json, base64, time, requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / '.env.local')

OPENAI_KEY = os.environ['OPENAI_API_KEY']
SUPABASE_URL = os.environ['NEXT_PUBLIC_SUPABASE_URL']
SUPABASE_SERVICE_KEY = os.environ['SUPABASE_SERVICE_ROLE_KEY']
SUPABASE_ANON_KEY = os.environ['NEXT_PUBLIC_SUPABASE_ANON_KEY']
BUCKET = 'library'
FOLDER = 'articles/gpt-image'

# Thèmes culturels par slug
PROMPTS = {
    'chefferie-anatomie-pouvoir': "A symbolic Congo Basin scene: two opposing yet complementary forces — a crowned leopard in shadows (Mbey) and a wise female elder speaking to a council under a sacred tree. Traditional Sakata geometric patterns frame the composition. Rich earth tones, deep indigos, gold accents. Digital art, painterly style.",
    'chefferie-equilibre-deux-mondes': "Duality of visible and invisible worlds in Sakata culture: a village chief at twilight between physical village (warm sunset) and spirit realm (moonlit forest with ancestral shadows). A baobab bridges both worlds. Sacred Nkisi statues at threshold. Digital art, cinematic lighting.",
    'origines-bantou-basakata': "Ancient Bantu migration: Sakata ancestors navigating the Congo River in carved dugout canoes at dawn. Mist rising from water, dense equatorial forest on banks. Traditional Sakata spear and shield symbols. Dramatic golden hour lighting. Digital art, epic scale.",
    'royaume-congo-racines': "Grandeur of Kongo Kingdom: Mbanza Kongo royal court with elaborately dressed nobles, Mani Kongo on carved throne adorned with raffia textiles and copper ornaments. Cowrie shells, leopard skins, geometric Kongo patterns. Warm terracotta, gold, crimson. Digital art, historical style.",
    'epopee-peuple-sakata': "Epic journey from Kongo Kingdom to Lake Mai-Ndombe: Sakata clan traveling through diverse Congolese landscapes from savannah to rainforest to great lake. Multi-generational group with elders, warriors, children. Lake appears on horizon like shimmering promise. Digital art, epic composition.",
    'lukeni-lua-nimi-fondateur': "Lukeni lua Nimi, legendary founder, silhouetted against blood-red sunset. He holds ceremonial spear, nkisi power figure glows at his feet. Ancestors' shadows surround him. Kongo cosmogram (dikenga) inscribed in earth beneath. Dramatic chiaroscuro, digital art.",
    'culture-generale-mboka': "Vibrant Mboka village scene: central meeting place under large tree where elders teach youth. Women preparing manioc, children playing traditional games, fishermen returning with catch. Traditional Sakata houses with woven palm frond roofs. Warm joyful atmosphere. Digital art, folk style.",
    'proverbes-nkundi-sagesse': "Visual representation of Nkundi proverbs: elder's face emerging from ancient tree bark, words transforming into golden symbols. Scenes illustrating Sakata wisdom: tortoise (patience), river (life's flow), interlocked hands (community). Sepia with gold highlights. Digital art.",
    'langue-kisakata-introduction': "Kisakata language as living tree: roots in Bantu soil, trunk with core vocabulary, branches bearing words as glowing fruits. Storyteller beneath tree, words flowing from mouth like river of light. Traditional Sakata patterns as borders. Rich greens, warm amber. Digital art, ethereal.",
    'corps-esprit-souffle': "Sakata trinity of body, spirit, breath: three translucent overlapping figures — physical (earth tones), spiritual (indigo/violet), ethereal breath (golden mist). They dance around central fire. Moyo life energy as glowing connecting threads. Digital art, spiritual abstract.",
    'energie-vitale-moyo': "Moyo vital life force: human figure radiating concentric waves of golden energy. Heart center glows brightest. Traditional healers' symbols and medicinal plants circle figure. Dikenga cosmogram as background mandala. Deep blue to warm gold center. Digital art, visionary style.",
    'rite-ngongo-sagesse': "Ngongo initiation rite: young initiate in white raffia cloth kneeling before elders in forest clearing at dawn. Sacred masks presented. Ancestral spirits as luminous forms in misty trees. Ritual objects (nkisi, drums, palm wine) in sacred circle. Digital art, mystical atmosphere.",
    'artisanat-masques-sculptures': "Sakata master sculptor in workshop, surrounded by masks at various stages from rough wood blocks to finished painted pieces. Tools, pigments, raffia fibers. Sunlight through thatched roof illuminates floating wood dust like gold. Digital art, warm workshop atmosphere.",
    'ngongo-philosophique-short': "Abstract Ngongo breath: stylized Sakata initiate meditating, breath visible as sacred geometry spiraling upward into cosmos. Kongo cosmogram elements, ochre, indigo, white palette. Digital art, minimal spiritual style.",
    'ngongo-technique': "Structure of Ngongo knowledge: circular gathering where elders pass knowledge to initiates through ritual objects — masks, carved tablets, sacred plants. Circle represents dikenga. Firelight illuminates faces. Digital art, documentary style.",
    'ngongo-philosophique': "Journey of becoming through Ngongo: five figures showing transformation stages from child to initiated elder, each stage glowing brighter. Background transitions from earthly forest to celestial realm. Sakata mask symbolism at each stage. Digital art, transformative sequence.",
    'ngongo-technique-short': "Essence of Ngongo in single image: elder's hands passing sacred nkisi figure to younger hands, transfer point glowing with ancestral energy. Sakata textile patterns as borders. Intimate, symbolic digital art.",
    'iluo-systeme-complet': "Sacred Iluo knowledge system visualized as an ancient Congolese tree of wisdom with five ascending branches, each representing a spiritual grade. Golden geometric patterns inspired by Sakata textile art flow upward. Warm earth tones, deep indigos. Digital art, symbolic spiritual style without human figures.",
    'iluo-systeme-court': "Five pillars of Iluo as five sacred trees growing from single root system deep in Congolese soil. Each tree has distinct leaves, flowers, fruits representing different aspects. Golden light from roots. Digital art, botanical symbolic style.",
    'iluo-epopee-longue': "Epic of Iluo as grand narrative scroll: key scenes from long version unfolding horizontally — discovery of double, command of invisible, mastery of night doubles. Sakata visual storytelling tradition, rich detail. Digital art, panoramic epic style.",
    'iluo-epopee-courte': "Secret of the double in Iluo: Sakata person facing spiritual double — identical yet luminous, connected by thread of light. Double exists in parallel spirit realm shown through water veil. Moonlight, reflection, mystery. Digital art, contemplative dual portrait.",
}


def log(msg):
    print(msg, flush=True)


def generate_image(prompt):
    log("  🎨 Generating...")
    r = requests.post('https://api.openai.com/v1/images/generations',
        headers={'Authorization': f'Bearer {OPENAI_KEY}', 'Content-Type': 'application/json'},
        json={'model': 'gpt-image-1', 'prompt': prompt, 'n': 1, 'size': '1024x1024'},
        timeout=120)
    if r.status_code != 200:
        log(f"  ❌ API error {r.status_code}: {r.text[:300]}")
        return None
    data = r.json()
    b64 = data['data'][0].get('b64_json')
    if not b64:
        log(f"  ❌ No b64_json: {list(data['data'][0].keys())}")
        return None
    log(f"  ✅ Image: {len(b64)} bytes")
    return base64.b64decode(b64)


def upload_to_supabase(img_bytes, filename, max_retries=3):
    """Upload avec retry sur erreurs transitoires (SSL, timeout)."""
    for attempt in range(max_retries):
        try:
            return _do_upload(img_bytes, filename)
        except Exception as e:
            if attempt < max_retries - 1:
                log(f"  ⚠️ Upload attempt {attempt+1} failed: {e}")
                time.sleep(5)
            else:
                log(f"  ❌ Upload failed after {max_retries} attempts: {e}")
                return None

def _do_upload(img_bytes, filename):
    path = f'{FOLDER}/{filename}.png'
    log(f"  📤 Upload {path}...")
    r = requests.post(f'{SUPABASE_URL}/storage/v1/object/{BUCKET}/{path}',
        headers={'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}', 'Content-Type': 'image/png', 'x-upsert': 'true'},
        data=img_bytes, timeout=30)
    if r.status_code not in (200, 201):
        log(f"  ❌ Upload error {r.status_code}: {r.text[:200]}")
        return None
    url = f'{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{path}'
    log(f"  ✅ {url}")
    return url


def update_db(article_id, url):
    r = requests.patch(f'{SUPABASE_URL}/rest/v1/articles?id=eq.{article_id}',
        headers={'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}', 'apikey': SUPABASE_ANON_KEY,
                 'Content-Type': 'application/json', 'Prefer': 'return=minimal'},
        json={'featured_image': url}, timeout=15)
    return r.status_code in (200, 204)


def main():
    r = requests.get(f'{SUPABASE_URL}/rest/v1/articles?select=id,title,slug,featured_image',
        headers={'apikey': SUPABASE_ANON_KEY, 'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}'}, timeout=15)
    articles = r.json()
    log(f"📋 {len(articles)} articles\n")

    to_process = [a for a in articles if a['slug'] in PROMPTS and 'gpt-image' not in (a.get('featured_image') or '')]
    skipped = len([a for a in articles if a['slug'] in PROMPTS]) - len(to_process)
    log(f"🎯 {len(to_process)} à traiter ({skipped} déjà faits)\n")

    ok = 0
    for i, a in enumerate(to_process):
        slug = a['slug']
        title_raw = a.get('title', {})
        title = title_raw.get('fr') or (list(title_raw.values())[0] if isinstance(title_raw, dict) and title_raw else 'Sans titre')
        log(f"[{i+1}/{len(to_process)}] {title[:70]}")

        img = generate_image(PROMPTS[slug])
        if not img:
            continue

        url = upload_to_supabase(img, f"{slug}_{int(time.time())}")
        if not url:
            continue

        if update_db(a['id'], url):
            log(f"  💾 DB OK\n")
            ok += 1
        else:
            log(f"  ⚠️ DB update failed\n")

        time.sleep(1)

    log(f"\n✅ {ok}/{len(to_process)} images traitées")


if __name__ == '__main__':
    main()
