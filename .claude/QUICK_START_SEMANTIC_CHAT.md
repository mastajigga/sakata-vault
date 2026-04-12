# Semantic Chat API — Quick Start (5 Minutes)

**Goal:** Test the semantic chat API that searches PDFs and generates intelligent responses  
**Time:** 5 minutes  
**Status:** ✅ Ready to go

---

## 🚀 Step-by-Step

### Terminal 1: Start Dev Server

```bash
cd "C:\Users\Fortuné\Projects\Sakata\.claude\worktrees\cranky-nobel"
npm run dev
```

Wait for:
```
✓ Ready in 2.5s
- Local: http://localhost:3000
```

### Terminal 2: Test the API

```bash
cd "C:\Users\Fortuné\Projects\Sakata"
python scripts/test_semantic_chat.py "Explique-moi l'Iluo"
```

Wait for response (3-5 seconds)

### Expected Output

```
🔍 Question: Explique-moi l'Iluo
🔗 Endpoint: http://localhost:3000/api/chat/semantic
⏳ Searching Pinecone and generating response...

────────────────────────────────────────────────────────────────
📚 SEMANTIC CHAT RESPONSE
────────────────────────────────────────────────────────────────

❓ QUESTION:
Explique-moi l'Iluo

✨ ANSWER:
[Claude's intelligent response about Iluo with synthesis of:
- "Iluo : Le Regard du Pouvoir" article
- "Le corps, l'esprit et le souffle" article
- Academic PDFs on spirituality]

📖 SOURCES (3 results):
   1. Iluo : Le Regard du Pouvoir (book) [Relevance: 83%]
   2. Le corps, l'esprit et le souffle (book) [Relevance: 82%]
   3. Religion et magie onder de Basakata (document) [Relevance: 79%]

⏱️ Metadata:
   Results searched: 10
   Timestamp: 2026-04-11T09:...
────────────────────────────────────────────────────────────────
```

✅ **Success!** The API is working.

---

## 🧪 Try More Questions

All in Terminal 2, same session:

### About Spirituality
```bash
python scripts/test_semantic_chat.py "Qu'est-ce que le Moyo"
python scripts/test_semantic_chat.py "Explique-moi la différence entre le corps, l'esprit et le souffle"
python scripts/test_semantic_chat.py "Raconte-moi le rite Ngongo"
```

### About History
```bash
python scripts/test_semantic_chat.py "Raconte-moi l'épopée du peuple Sakata"
python scripts/test_semantic_chat.py "Qui était Lukeni lua Nimi"
python scripts/test_semantic_chat.py "Histoire du Royaume du Congo"
```

### About Culture
```bash
python scripts/test_semantic_chat.py "Quels sont les concepts importants dans la culture Basakata"
python scripts/test_semantic_chat.py "Comment les chefferies Sakata sont-elles organisées"
```

### Custom Search Depth
```bash
# Search only 5 sources instead of default 10
python scripts/test_semantic_chat.py "Iluo" --top-k 5

# Search all 20 most relevant sources
python scripts/test_semantic_chat.py "Iluo" --top-k 20
```

---

## 🔍 What's Actually Happening

When you ask a question:

1. **Question Embedding** (50ms)
   - "Explique-moi l'Iluo" → 768-dimensional vector

2. **Pinecone Search** (200ms)
   - Search across 1543 vectors:
     - 1534 academic PDFs
     - 9 site articles
   - Find top 10 most relevant passages

3. **Claude Synthesis** (2-5 seconds)
   - Takes all 10 passages
   - Reads them into Claude
   - Asks Claude to synthesize intelligent response
   - Returns answer + sources

4. **Pretty Print** (instant)
   - CLI formats the response nicely
   - Shows scores, sources, metadata

---

## ⏱️ Performance

| Step | Duration |
|------|----------|
| Embed query | 50ms |
| Search Pinecone | 200ms |
| Claude synthesis | 2-5s |
| Display result | <100ms |
| **TOTAL** | **2.5-5.5s** |

✅ **Fast enough for real-time chat**

---

## ❌ If Something Goes Wrong

### "Cannot connect to API"
```bash
# In Terminal 1, did you see "✓ Ready in 2.5s"?
# If not, check for errors or restart:
npm run dev
```

### "ModuleNotFoundError: No module named 'requests'"
```bash
# Install Python requests
pip install requests
```

### "Embedding model not available"
```bash
# Reinstall transformers
npm install @xenova/transformers

# Or restart dev server
npm run dev
```

### "Pinecone API key not configured"
```bash
# Check .env.local exists in your worktree directory
# Should have:
# PINECONE_API_KEY=pcsk_7Y6...
# ANTHROPIC_API_KEY=sk-ant-...

# Then restart dev server
npm run dev
```

---

## 📊 Pinecone Index Stats

Check what's actually indexed:

**In Terminal 2:**
```bash
python scripts/pinecone_cli.py stats
```

**Expected output:**
```json
{
  "total_vectors": 1543,
  "dimension": 768,
  "namespaces": {
    "__default__": 1534,
    "iluo_livres_site": 9
  }
}
```

---

## 🎯 What This Actually Does

For your request: **"Give me intelligent responses from these PDFs"**

**Example Flow:**

1. You ask: `"Explique-moi l'Iluo et son rôle spirituel"`

2. System searches 1543 vectors and finds:
   - **Iluo : Le Regard du Pouvoir** (0.83 relevance)
   - **Le corps, l'esprit et le souffle** (0.82 relevance)
   - **Religion et magie onder de Basakata** (0.79 relevance)
   - [7 more passages]

3. Claude reads all 10 passages and writes:
   ```
   L'Iluo est la capacité de voir au-delà du visible.
   C'est une force spirituelle qui accompagne les chefs
   et les initiés dans notre culture...
   
   [Complete synthesized response with all sources integrated]
   ```

4. You get: Complete answer + 3-5 source attributions

---

## 📁 Files You're Testing

```
src/app/api/chat/semantic/route.ts
  ↑ API endpoint (searches PDFs, calls Claude)

scripts/test_semantic_chat.py
  ↑ CLI tester (makes requests, displays results)

Pinecone Index: "sakata"
  ├─ 1534 academic PDFs
  └─ 9 site articles
  
Claude API
  └─ Synthesizes responses
```

---

## ✅ Success Criteria

✅ You see the answer in < 6 seconds  
✅ Sources are shown with relevance scores  
✅ Claude's response synthesizes from multiple sources  
✅ No errors in terminal  

**If all 4 are true → API is working perfectly!**

---

## 🚀 What's Next (Optional)

After testing:
- Phase 2: Add 48+ school exercises
- Phase 3: Add 7 territory descriptions
- Phase 4: Build React UI component

But first: **Test the API!** 🧪

---

## 💬 Go Test It!

```bash
# Terminal 1
npm run dev

# Terminal 2
python scripts/test_semantic_chat.py "Explique-moi l'Iluo"
```

**Then let me know what you see!** 🎉

---

**Created:** 2026-04-11  
**Status:** Ready to test  
**Time to test:** 5 minutes
