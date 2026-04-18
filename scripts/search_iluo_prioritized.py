import subprocess
import json
import sys

# Hand-verified directory names from the index
folders = [
    "L'evangelisation du Mai-nDombe - Histoire, difficultes presntes et inculturation",
    "Religie en magie onder de Basakata_1952",
    "Sakata (profil DICE – Dictionary of Indigenous Cultural Expressions)",
    "Sociétés secètes au Congo Belge",
    "The Sakata Society in the Congo - Roger Vanzila Munsi",
    "Programme scolaire congolais"
]

query = "Iluo pouvoir spirituel double excellence asima mvula baluo nkumambè nkundi"
all_context = []

for folder in folders:
    print(f"Searching in: {folder}...")
    cmd = [
        "python", "scripts/pinecone_cli.py",
        "search", query,
        "--top_k", "8",
        "--filter", f"directory={folder}"
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True, encoding='utf-8')
        matches = json.loads(result.stdout)
        for match in matches:
            text = match.get('metadata', {}).get('text', '')
            source = match.get('metadata', {}).get('source', 'Unknown')
            all_context.append(f"SOURCE: {source} (Folder: {folder})\n{text}\n")
    except Exception as e:
        print(f"Error searching {folder}: {e}")

with open("prioritized_iluo_context.md", "w", encoding="utf-8") as f:
    f.write("# Prioritized Iluo Context\n\n")
    f.write("\n\n---\n\n".join(all_context))

print(f"Done! Collected {len(all_context)} context chunks.")
