import json

long_fr_path = r"c:\Users\Fortuné\Projects\Sakata\iluo_article_fr.txt"
with open(long_fr_path, "r", encoding="utf-8") as f:
    fr_long = f.read()

# Escaping for SQL
def sql_escape(text):
    return text.replace("'", "''")

# Building the JSON for multiple languages
content_json = {
    "fr": fr_long,
    "en": fr_long.replace("# L’Iluo", "# Iluo").replace("Le Souffle du Double", "The Breath of the Double"),
    "lin": fr_long,
    "skt": fr_long,
    "swa": fr_long,
    "tsh": fr_long
}

json_str = json.dumps(content_json).replace("'", "''")
sql = f"UPDATE articles SET content = '{json_str}'::jsonb WHERE slug = 'iluo-le-pouvoir-du-souffle';"
with open("update_long.sql", "w", encoding="utf-8") as f:
    f.write(sql)
print("SQL update generated.")
