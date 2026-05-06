#!/usr/bin/env python3
"""
Facebook Scraper Humain — Sakata Corpus
========================================
Scrape les groupes/pages Facebook Basakata en imitant un comportement humain :
délais aléatoires, scroll progressif, pauses naturelles.

Usage:
    python3 scripts/fb_scraper_human.py              # Scrape toutes les cibles
    python3 scripts/fb_scraper_human.py --setup      # Login interactif
    python3 scripts/fb_scraper_human.py --scrolls 40 # Plus de scrolls
"""

import sys, os, io, json, time, random, hashlib, argparse
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local'), override=True)

# ── Config ────────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
SESSION_DIR = Path.home() / ".sakata-fb-scraper-py"
DATA_DIR.mkdir(exist_ok=True)
SESSION_DIR.mkdir(exist_ok=True)

FB_EMAIL = os.getenv("FB_EMAIL", "masta.jigga@gmail.com")
FB_PASSWORD = os.getenv("FB_PASSWORD", "")

TARGETS = [
    {"url": "https://www.facebook.com/groups/508413489258998/", "label": "Groupe Basakata 508413", "type": "group"},
    {"url": "https://www.facebook.com/groups/2623391397880027/", "label": "Groupe Basakata 2623391", "type": "group"},
    {"url": "https://www.facebook.com/groups/258101250381809/", "label": "Groupe Basakata 258101", "type": "group"},
    {"url": "https://www.facebook.com/groups/1444575149127305/", "label": "Groupe Basakata 1444575", "type": "group"},
    {"url": "https://www.facebook.com/p/LES-Basakata-Questionsreponses-100067644754615/", "label": "Page LES Basakata", "type": "page"},
    {"url": "https://www.facebook.com/people/BANA-Basakata-South-Africa/100071159959368/", "label": "Profil BANA SA", "type": "profile"},
]

def human_delay(min_s=0.8, max_s=3.5):
    """Délai aléatoire pour imiter un humain."""
    time.sleep(min_s + random.random() * (max_s - min_s))

def human_scroll(page, scrolls=30):
    """Scroll progressif avec comportement humain."""
    for i in range(scrolls):
        amount = random.randint(400, 750)
        # Note: appelé depuis une fonction async, mais on garde evaluate ici
        # car c'est appelé depuis scrape_target qui gère l'async
        pass  # On gère le scroll directement dans scrape_target

async def extract_posts(page, source_url, source_label, source_type):
    """Extrait les posts visibles avec Playwright."""
    posts = await page.evaluate("""
        ({sourceUrl, sourceLabel, sourceType}) => {
            const posts = [];
            const articles = document.querySelectorAll('div[role="article"]');
            
            for (const art of articles) {
                try {
                    // Auteur
                    const authorEl = art.querySelector('h2 strong span, h3 strong span, h2 a strong, h3 a strong') ||
                                    art.querySelector('a[role="link"][aria-label]');
                    const author = authorEl?.textContent?.trim() || "Anonyme";
                    
                    // Contenu
                    const textEls = art.querySelectorAll('div[dir="auto"]');
                    let content = '';
                    for (const el of textEls) {
                        const t = el.innerText?.trim();
                        if (t && t.length > 30) {
                            content += t + '\\n\\n';
                        }
                    }
                    content = content.trim();
                    if (!content || content.length < 50) continue;
                    
                    // Permalink
                    let permalink = null;
                    const links = art.querySelectorAll('a[href*="/posts/"], a[href*="/permalink/"]');
                    for (const a of links) {
                        const href = a.getAttribute('href');
                        if (href) {
                            permalink = href.startsWith('http') ? href : 'https://www.facebook.com' + href;
                            break;
                        }
                    }
                    
                    // Timestamp
                    let timeText = null;
                    const timeEl = art.querySelector('a[aria-label*="20"], a[aria-label*="il y a"], a[aria-label*="hier"]');
                    if (timeEl) timeText = timeEl.getAttribute('aria-label');
                    
                    // Images
                    const images = [];
                    const imgEls = art.querySelectorAll('img[src*="scontent"], img[src*="fbcdn"]');
                    for (const img of imgEls) {
                        const src = img.getAttribute('src');
                        if (src) images.push(src);
                    }
                    
                    posts.push({
                        source: permalink || sourceUrl,
                        source_container: sourceUrl,
                        source_label: sourceLabel,
                        title: content.split('\\n')[0].slice(0, 100),
                        content: content,
                        images: images,
                        metadata: {
                            author: author,
                            type: "facebook_post",
                            container_type: sourceType,
                            time_text: timeText,
                            tags: []
                        }
                    });
                } catch(e) {}
            }
            return posts;
        }
    """, {"sourceUrl": source_url, "sourceLabel": source_label, "sourceType": source_type})
    
    return posts

async def login_facebook(context):
    """Login Facebook avec gestion 2FA/captcha."""
    from playwright.async_api import async_playwright
    
    page = await context.new_page()
    print("\n🔐 Navigation vers Facebook...")
    await page.goto("https://www.facebook.com/", wait_until="domcontentloaded", timeout=30000)
    human_delay(2, 4)
    
    # Accepter les cookies
    try:
        btn = page.locator('button[data-cookiebanner="accept_button"], button:has-text("Autoriser")').first
        await btn.click(timeout=3000)
        human_delay(1, 2)
    except:
        pass
    
    print(f"📧 Remplissage email: {FB_EMAIL}")
    try:
        await page.fill('input[name="email"], input[type="text"][id="email"]', FB_EMAIL)
        human_delay(1, 2)
        await page.fill('input[name="pass"], input[type="password"]', FB_PASSWORD)
        human_delay(1, 2)
        
        # Cliquer sur Connexion — essayer plusieurs sélecteurs
        login_clicked = False
        for selector in [
            'button[name="login"]',
            'button:has-text("Se connecter")',
            'button:has-text("Log in")',
            'button[type="submit"]',
            'div[role="button"]:has-text("Se connecter")',
            'div[role="button"]:has-text("Log In")',
            'button._42ft[type="submit"]',
        ]:
            try:
                btn = page.locator(selector).first
                await btn.click(timeout=3000)
                login_clicked = True
                print(f"   ✅ Clic via: {selector}")
                break
            except:
                continue
        
        if not login_clicked:
            # Screenshot pour debug
            print("   ⚠️  Bouton login introuvable, capture d'écran...")
            await page.screenshot(path=str(PROJECT_ROOT / "data" / "fb_login_debug.png"))
            print(f"   📸 Capture: data/fb_login_debug.png")
            # Essayer de taper Entrée dans le champ password
            await page.keyboard.press("Enter")
            print("   Tentative avec Entrée...")
        
        # Vérifier si on est connecté
        current_url = page.url
        if "checkpoint" in current_url or "login" in current_url:
            # Vérification demandée — screenshot
            print("\n⚠️  Facebook demande une vérification !")
            screenshot_path = str(PROJECT_ROOT / "data" / "fb_checkpoint.png")
            await page.screenshot(path=screenshot_path)
            print(f"   Capture sauvegardée: {screenshot_path}")
            print("   👉 Vérifie la capture et termine la vérification manuellement.")
            print("   Appuie sur ENTRÉE quand c'est fait...")
            input()
        
        print("✅ Connecté à Facebook")
    except Exception as e:
        print(f"❌ Erreur login: {e}")
        await page.screenshot(path=str(PROJECT_ROOT / "data" / "fb_login_error.png"))
    
    await page.close()

async def scrape_target(context, target, scrolls):
    """Scrape une cible Facebook."""
    from playwright.async_api import async_playwright
    
    page = await context.new_page()
    print(f"\n📄 {target['label']}")
    print(f"   {target['url']}")
    
    try:
        await page.goto(target['url'], wait_until="domcontentloaded", timeout=60000)
        human_delay(3, 6)
        
        # Vérifier login wall
        if "login" in page.url or "checkpoint" in page.url:
            print("   ⚠️  Login requis — exécute --setup d'abord")
            await page.close()
            return []
        
        # Vérifier groupe fermé
        body_text = await page.inner_text("body")
        if "Vous devez être membre" in body_text or "groupe privé" in body_text.lower():
            print("   ⚠️  Groupe fermé — impossible d'accéder")
            await page.close()
            return []
        
        # Attendre les articles
        try:
            await page.wait_for_selector('div[role="article"]', timeout=15000)
        except:
            print("   ⚠️  Aucun article trouvé (layout différent?)")
        
        # Scroll + extraction
        all_posts = {}
        for i in range(scrolls):
            visible = await extract_posts(page, target['url'], target['label'], target['type'])
            
            new_count = 0
            for p in visible:
                h = hashlib.sha1(p['content'].encode()).hexdigest()[:16]
                if h not in all_posts:
                    all_posts[h] = p
                    new_count += 1
            
            if i % 5 == 0 or new_count > 0:
                print(f"   scroll {i+1}/{scrolls} → +{new_count} (total {len(all_posts)})")
            
            # Scroll humain
            amount = random.randint(400, 750)
            await page.evaluate(f"window.scrollBy(0, {amount})")
            human_delay(1.5, 4.0)
            
            if i > 0 and i % 8 == 0:
                print(f"      📖 pause lecture...")
                human_delay(4, 8)
        
        result = list(all_posts.values())
        print(f"   ✅ {len(result)} posts collectés")
        await page.close()
        return result
        
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        try:
            await page.close()
        except:
            pass
        return []

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--setup", action="store_true", help="Mode login interactif")
    parser.add_argument("--scrolls", type=int, default=30, help="Nombre de scrolls par cible")
    parser.add_argument("--url", type=str, help="URL unique à scraper")
    parser.add_argument("--headless", action="store_true", help="Mode headless")
    args = parser.parse_args()
    
    from playwright.async_api import async_playwright
    
    async with async_playwright() as p:
        # Lancer le navigateur
        browser_args = {
            "headless": args.headless,
        }
        
        browser = await p.chromium.launch(
            headless=args.headless,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-features=IsolateOrigins,site-per-process",
                "--no-sandbox",
                "--disable-setuid-sandbox",
            ]
        )
        
        context = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            locale="fr-FR",
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            extra_http_headers={"Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8"}
        )
        
        # Ajouter des cookies initiaux pour paraître plus humain
        await context.add_init_script("""
            // Supprimer le flag webdriver
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            // Simuler des plugins
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            // Simuler languages
            Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'fr', 'en-US', 'en'] });
        """)
        
        if args.setup:
            print("🔐 Mode setup — login Facebook")
            print(f"   Email configuré: {FB_EMAIL}")
            if not FB_PASSWORD:
                print("   ⚠️  FB_PASSWORD non défini dans .env.local")
                print("   Ajoute: FB_PASSWORD=ton_mot_de_passe")
                return
            
            await login_facebook(context)
            
            # Sauvegarder la session
            await context.storage_state(path=str(SESSION_DIR / "state.json"))
            print(f"✅ Session sauvegardée: {SESSION_DIR}/state.json")
            await browser.close()
            return
        
        # Mode scraping : charger la session
        state_file = SESSION_DIR / "state.json"
        if state_file.exists():
            context = await browser.new_context(
                storage_state=str(state_file),
                viewport={"width": 1280, "height": 900},
                locale="fr-FR",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )
        else:
            print("❌ Pas de session. Lance --setup d'abord.")
            await browser.close()
            return
        
        targets = [{"url": args.url, "label": args.url, "type": "custom"}] if args.url else TARGETS
        print(f"🎯 {len(targets)} cibles · {args.scrolls} scrolls/cible")
        
        all_posts = []
        for target in targets:
            posts = await scrape_target(context, target, args.scrolls)
            all_posts.extend(posts)
        
        await browser.close()
        
        # Sauvegarder
        stamp = time.strftime("%Y%m%d_%H%M%S")
        batch_path = DATA_DIR / f"scraped_fb_{stamp}.json"
        with open(batch_path, 'w', encoding='utf-8') as f:
            json.dump(all_posts, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Batch: {batch_path} ({len(all_posts)} posts)")
        
        # Merge avec données existantes
        cumulative_path = DATA_DIR / "scraped_fb_data.json"
        existing = []
        if cumulative_path.exists():
            try:
                existing = json.loads(cumulative_path.read_text(encoding='utf-8'))
            except:
                pass
        
        seen = {}
        for p in existing:
            h = hashlib.sha1(p.get('content', '').encode()).hexdigest()[:16]
            seen[h] = p
        
        added = 0
        for p in all_posts:
            h = hashlib.sha1(p.get('content', '').encode()).hexdigest()[:16]
            if h not in seen:
                seen[h] = p
                added += 1
        
        with open(cumulative_path, 'w', encoding='utf-8') as f:
            json.dump(list(seen.values()), f, ensure_ascii=False, indent=2)
        print(f"📚 Cumulatif: {cumulative_path} (+{added} nouveaux, {len(seen)} total)")
        
        # Indexation Pinecone
        if added > 0:
            print(f"\n🔜 Pour indexer dans Pinecone:")
            print(f"   python3 scripts/index_facebook_to_pinecone.py")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
