# Facebook Scraping → Pinecone

Pipeline pour scraper les groupes/pages Facebook diaspora Basakata et les
intégrer dans le Cerveau Sakata (Pinecone).

## 🎯 Cibles configurées (modifiables dans `scrape-facebook.mjs`)

| Type | URL |
|---|---|
| Groupe | facebook.com/groups/508413489258998/ |
| Groupe | facebook.com/groups/2623391397880027/ |
| Groupe | facebook.com/groups/258101250381809/ |
| Groupe | facebook.com/groups/1444575149127305/ |
| Page | facebook.com/p/LES-Basakata-Questionsreponses-100067644754615/ |
| Profil | facebook.com/people/BANA-Basakata-South-Africa/100071159959368/ |

---

## 🚀 Workflow complet

### Étape 1 — Setup session (UNE SEULE FOIS)

```bash
node scripts/scrape-facebook.mjs --setup
```

Un navigateur s'ouvre. **Connecte-toi à Facebook manuellement** (email + mot
de passe + 2FA si activé). Une fois connecté, **reviens dans le terminal et
appuie sur ENTRÉE**.

La session est sauvegardée dans `~/.sakata-fb-scraper/` (ton ordi local
uniquement, JAMAIS commité).

### Étape 2 — Scraping

```bash
# Scrape toutes les cibles (~30 scrolls par page = 30-90 posts chacune)
node scripts/scrape-facebook.mjs

# Plus profond (50 scrolls = beaucoup plus de posts mais plus long)
node scripts/scrape-facebook.mjs --scrolls 50

# Une URL spécifique seulement
node scripts/scrape-facebook.mjs --url https://www.facebook.com/groups/...

# En mode visible (pour debug ou voir ce qui se passe)
node scripts/scrape-facebook.mjs --headed
```

**Output :**
- `data/scraped_fb_<timestamp>.json` — batch courant
- `data/scraped_fb_data.json` — cumulatif dédupliqué (utilisé par l'ingest)

### Étape 3 — Indexation dans Pinecone

```bash
# Dry-run (vérifier ce qui sera indexé sans toucher Pinecone)
python scripts/index_facebook_to_pinecone.py --dry-run

# Pour de vrai
python scripts/index_facebook_to_pinecone.py

# Force re-indexation même des posts déjà présents
python scripts/index_facebook_to_pinecone.py --force
```

L'indexation est **idempotente** : ré-exécuter ne crée pas de doublons.
Les posts sont indexés dans le namespace `iluo_forums`.

---

## ⚠️ Considérations Facebook

### Groupes fermés
Si tu n'es pas membre du groupe, le scraper renvoie une ligne :
```
⚠️  Closed group — you need to be a member.
```
**Demande à rejoindre le groupe** avant de relancer.

### Anti-automation
Facebook détecte les comportements robotiques. Le scraper :
- Utilise une vraie session (cookies persistés)
- Scroll avec délais aléatoires (900-1800 ms)
- Pas de requêtes parallèles
- Locale `fr-FR`

Si Facebook **te bloque temporairement** :
1. Attends 24-48h
2. Réduis `--scrolls` (10 au lieu de 30)
3. Espace les runs de plusieurs heures

### Permalinks instables
Les URLs des posts peuvent changer. Le scraper utilise la SHA-1 du contenu
comme clé de déduplication, pas l'URL.

---

## 📊 Format des données

### `data/scraped_fb_data.json`

```json
[
  {
    "source": "https://www.facebook.com/groups/.../posts/123/",
    "source_container": "https://www.facebook.com/groups/.../",
    "source_label": "Groupe Basakata 508413",
    "title": "Première ligne du post...",
    "content": "Texte intégral du post sur plusieurs lignes...",
    "metadata": {
      "author": "Nom Prénom",
      "type": "facebook_post",
      "container_type": "group",
      "time_text": "il y a 3 heures",
      "tags": []
    }
  }
]
```

### Pinecone — namespace `iluo_forums`

Chaque post devient 1 vecteur (ou plusieurs chunks si > 400 mots).

ID format : `fb__<sha1_short>` ou `fb__<sha1_short>__c<chunk_index>`

Metadata indexée :
- `source`, `title`, `author`, `type`, `container_type`
- `source_label`, `source_container`, `time_text`, `tags`
- `text` (1000 premiers chars pour ré-affichage)

---

## 🛠 Maintenance

### Ajouter une nouvelle cible

Édite `scripts/scrape-facebook.mjs`, ajoute une entrée dans `TARGETS` :

```js
{
  url: "https://www.facebook.com/groups/...",
  label: "Mon Nouveau Groupe",
  type: "group",  // group | page | profile
}
```

### Re-scrape périodique

Recommandation : 1× par mois pour capturer les nouvelles publications.
La déduplication par hash garantit qu'on ne réindexe pas les posts déjà vus.

### Vérifier le state Pinecone

```bash
node --env-file=.env.local scripts/pinecone_stats.mjs
```

Tu devrais voir le compteur `iluo_forums` augmenter à chaque ingestion.

### Inspecter quelques posts indexés

```bash
node --env-file=.env.local scripts/pinecone_inspect.mjs
```

---

## 🔐 Sécurité

- **Session FB** : stockée dans `~/.sakata-fb-scraper/`. Privée. Jamais dans le repo.
- **Données scrappées** : usage interne (corpus RAG). Pas de re-publication
  verbatim sans consentement explicite des auteurs.
- **RGPD** : si quelqu'un demande la suppression, recherche `author = "..."`
  dans Pinecone et supprime via le SDK.

---

## ✅ Pipeline complet en 3 commandes

```bash
# 1. (une seule fois) Login FB
node scripts/scrape-facebook.mjs --setup

# 2. Scrape
node scripts/scrape-facebook.mjs

# 3. Indexe
python scripts/index_facebook_to_pinecone.py
```
