import subprocess
import json

def index_passage(id, passage, metadata):
    namespace = "sakata"
    cmd = [
        "python", "scripts/pinecone_cli.py",
        "--namespace", namespace,
        "store", id, passage,
        "--meta", json.dumps(metadata)
    ]
    print(f"Indexing {id}...")
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    if result.returncode != 0:
        print(f"Error indexing {id}: {result.stderr}")
    else:
        print(f"Index successful for {id}")

articles = [
    {"id":"896e7cea-48d3-4fec-8a21-05b17ad90abc","title":"Le Rite Ngongo : Le passage vers la sagesse","category":"culture","summary":"Décryptage du rite initiatique Ngongo, la porte d'entrée vers les mystères de l'existence.","content":"Écoute le tambour ancestral, mon enfant. Le rite Ngongo n'est pas une simple cérémonie ; c'est le pont entre l'enfance et l'âge adulte..."},
    {"id":"4720d4f6-1e65-434d-a0ec-84e014871365","title":"Les origines Bantou des Basakata","category":"histoire","summary":"Remontez le fil du temps pour comprendre comment notre peuple a traversé les millénaires...","content":"Sens-tu le vent des savanes, mon enfant ? Les origines bantoues des Sakata plongent dans les profondeurs de l'Afrique ancienne..."},
    {"id":"e6ec0b54-221c-46b0-b99f-c7d0d67e23ce","title":"Lukeni lua Nimi : L'ombre du fondateur","category":"histoire","summary":"Portrait du Manikongo originel dont l'aura influence encore aujourd'hui la structure sociale.","content":"Regarde l'ombre qui danse sur l'eau, mon enfant. Lukeni lua Nimi n'est pas un homme ordinaire..."},
    {"id":"704fe75e-5686-442c-8442-ee85bafda4ca","title":"Proverbes Nkundi et sagesse","category":"langue","summary":"Les Nkundi sont les perles de sagesse que les anciens nous ont léguées pour ne pas nous perdre.","content":"*“Nkasa moko ekoki kokanga mbuma te.”* (Une seule feuille ne peut pas emballer un fruit). La force est dans l'unité du village."},
    {"id":"41099b4e-1f68-402a-9442-14fdce01580b","title":"Le corps, l'esprit et le souffle","category":"culture","summary":"L'équilibre de l'homme Sakata repose sur trois piliers indissociables.","content":"Le corps est la pirogue, l'esprit est le rameur, et le souffle est le courant de la rivière."},
    {"id":"8c060305-861e-49dc-a9f0-dbf41aceaeb2","title":"L'énergie vitale (Moyo)","category":"culture","summary":"Comprendre le Moyo, cette force qui circule en nous et nous relie à tout ce qui vit.","content":"Le *Moyo* n'est pas seulement le cœur physique. C'est l'étincelle que les ancêtres nous ont confiée..."},
    {"id":"57d51d67-edb4-4494-97ff-97ba3710b04c","title":"Introduction à la langue Kisakata","category":"langue","summary":"Nos mots sont des clés. Apprenez les bases de la langue qui porte notre identité.","content":"Le *Kisakata* est comme la rivière Lukenie — elle coule depuis la nuit des temps..."},
    {"id":"5ec456d3-37a9-45bf-8950-9df520324223","title":"Culture Générale Mboka","category":"culture","summary":"Le concept de Mboka dépasse le simple village ; c'est un état d'esprit, une appartenance sacrée.","content":"Quand tu dis *mboka* (village), la terre écoute. C'est l'endroit où ton cordon ombilical..."},
    {"id":"fa39957b-d7d7-4d29-9319-28341df15047","title":"Iluo : Les doubles","category":"culture","summary":"Celui qui marche seul n'est jamais vraiment seul. Découvrez le concept de l'Iluo.","content":"Écoute le murmure des rivières jumelles, mon enfant. Les Iluo sont les gardiens de l'équilibre..."},
    {"id":"cbbacef1-e0f4-45db-b169-0aee891c835f","title":"Artisanat : Masques et Sculptures","category":"culture","summary":"Quand le bois parle, l'ancêtre écoute. Découvrez l'art sacré de la sculpture Sakata.","content":"Tailler le bois, c'est libérer l'esprit qui y dort. Nos masques ne sont pas des décorations..."},
    {"id":"ad22c041-9bd1-4602-8142-6b292c1b6cca","title":"L'épopée du peuple Sakata : Du Kongo au Mai-Ndombe","category":"histoire","summary":"Découvrez le voyage ancestral de nos pères...","content":"Approche-toi du feu sacré, mon enfant. L'épopée du peuple Sakata n'est pas une légende..."},
    {"id":"269f6129-0b1c-4b09-b512-2650972aff99","title":"Le Royaume du Congo : Nos racines","category":"histoire","summary":"Bien avant les frontières de papier, il y avait la pierre et le fer du Kongo.","content":"Approche-toi du trône ancestral, mon enfant. Le royaume du Kongo n'était pas seulement un empire..."}
]

for article in articles:
    # Index Summary
    sum_id = f"article_summary_{article['id']}"
    sum_passage = f"passage: Article Summary - {article['title']}: {article['summary']}"
    sum_meta = {"source": "article", "type": "summary", "category": article['category'], "title": article['title']}
    index_passage(sum_id, sum_passage, sum_meta)

    # Index Content (First 1500 chars to be safe)
    cont_id = f"article_content_{article['id']}"
    cont_passage = f"passage: Article Content - {article['title']}: {article['content'][:1500]}"
    cont_meta = {"source": "article", "type": "content", "category": article['category'], "title": article['title']}
    index_passage(cont_id, cont_passage, cont_meta)
