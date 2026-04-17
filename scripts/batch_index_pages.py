import subprocess
import os

def index_page(page_num, text, author="Jules Denis"):
    namespace = "sakata"
    passage = f"passage: {text}"
    id = f"chef_et_apotre_p{page_num}"
    
    # Building the metadata as a JSON string for the shell
    # Since we are on Windows, we need to handle escaping carefully
    import json
    meta = json.dumps({"author": author, "page": str(page_num)})
    
    cmd = [
        "python", "scripts/pinecone_cli.py",
        "--namespace", namespace,
        "store", id, passage,
        "--meta", meta
    ]
    
    print(f"Indexing Page {page_num}...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        print(f"Page {page_num} indexed successfully.")
    else:
        print(f"Error indexing Page {page_num}: {result.stderr}")

# Read the transcription file
with open("data/transcription_chef_et_apotre.md", "r", encoding="utf-8") as f:
    content = f.read()

# Split by pages
pages = content.split("## Page ")
for p in pages:
    if not p.strip() or p.strip().startswith("#"):
        continue
    
    lines = p.split("\n")
    page_num = lines[0].strip()
    page_text = " ".join(lines[1:]).strip()
    
    # Remove extra spaces
    page_text = " ".join(page_text.split())
    
    if page_num in ["9", "10", "11"]:
        index_page(page_num, page_text)
