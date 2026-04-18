import json
import os

def sql_escape(text):
    return text.replace("'", "''")

def main():
    json_path = "multilingual_iluo.json"
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            translations = json.load(f)
    except FileNotFoundError:
        print("JSON not found yet.")
        return

    # Create a list of SQL statements for individual tools calls if needed
    # but first I'll write them to a file just for reference
    sql_statements = []
    
    # Initialize the record if it doesn't have a content object (unlikely here but safe)
    # sql_statements.append("UPDATE articles SET content = '{}'::jsonb WHERE slug = 'iluo-le-pouvoir-du-souffle';")
    
    for lang, content in translations.items():
        # Using jsonb_set to update individual keys
        escaped_content = sql_escape(json.dumps(content, ensure_ascii=False))
        sql = f"UPDATE articles SET content = jsonb_set(COALESCE(content, '{{}}'::jsonb), '{{{lang}}}', '{escaped_content}'::jsonb) WHERE slug = 'iluo-le-pouvoir-du-souffle';"
        sql_statements.append(sql)
    
    with open("update_chunks.sql", "w", encoding="utf-8") as f:
        for s in sql_statements:
            f.write(s + "\n\n")
    
    print(f"Generated {len(sql_statements)} chunks in update_chunks.sql")

if __name__ == "__main__":
    main()
