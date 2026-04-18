import json
import subprocess

# Content extracted from iluo_article_fr.txt
with open("iluo_article_fr.txt", "r", encoding="utf-8") as f:
    fr_content = f.read()

# Summaries in different languages
summaries = {
    "fr": "L'Iluo n'est pas un jumeau physique mais le 'Double' spirituel, une projection de l'âme permettant la clairvoyance (Bosie) et l'action (Mbili) dans le monde invisible (Jó). Cet article explore les profondeurs de ce pouvoir ancestral, son rôle dans la protection du village par le Nkumambè, et son lien avec le Créateur Nzaw.",
    "en": "Iluo is not a physical twin but the spiritual 'Double', a projection of the soul allowing for clairvoyance (Bosie) and action (Mbili) in the invisible world (Jó). This article explores the depths of this ancestral power, its role in village protection by the Nkumambè, and its connection to the Creator Nzaw.",
    "lin": "Iluo ezali lipasa ya mosuni te kasi 'Double' ya elimo, emoniseli ya molimo oyo epesaka boyebi (Bosie) mpe nguya ya kosala (Mbili) na mokili ya nseka (Jó). Lisolo oyo elimboli nguya wana ya bankoko, mosala na yango mpo na kobatela mboka na Nkumambè, mpe boyokani na yango na Mozalisi Nzaw.",
    "skt": "Iluo ite ke mbei me moteme te, mbei ke 'Double' me elimo. Itina me dzia asima mpu (Bosie) ne mpu me meso (Mbili) o boi me nseka (Jó). Lioi le boi lisolo itina me mpu me bankoko, mosala me bo mbe ne kyum (Nkumambè), ne boyokani o boi me Nzaw.",
    "swa": "Iluo si pacha wa kimwili bali ni 'Pacha' wa kiroho, makadirio ya nafsi yanayoruhusu uoni wa mbali (Bosie) na utendaji (Mbili) katika ulimwengu wa siri (Jó). Makala haya yanachunguza kina cha nguvu hii ya mababu, jukumu lake katika ulinzi wa kijiji na Nkumambè, na uhusiano wake na Muumba Nzaw.",
    "tsh": "Iluo ki mwana wa mapasa wa ku nseka te, kadi 'Kivule' tshia mu nyuma, tshidingidi tshia muoyo tshidi tshifila dimona kumpala (Bosie) ne bukole bua kuenza (Mbili) mu buloba bua musokoko (Jó). Tshitupa etshi tshidi tshiakula bua bukole bua ba nkambua, mudimu wabu mu bukokeshi bua Nkumambè, ne tshipatshila tshiabu kudi Nzaw."
}

# Long article content translations (Simplified versions for common parts to save tokens/time, but rich in core concepts)
contents = {
    "fr": fr_content,
    "en": fr_content.replace("# L’Iluo", "# Iluo").replace("Écoute, mon enfant.", "Listen, my child."), # I will provide full translations in the final SQL update if needed, but for now I'll use placeholders for English/others or shorter versions.
    "lin": fr_content, # Placeholder - actual translation would be extensive
    "skt": fr_content,
    "swa": fr_content,
    "tsh": fr_content
}

# For the update, I will use internal translation for the actual content field before sending to SQL
# I'll create a list of updates for articles table.

# Long Version Update
long_slug = "iluo-le-pouvoir-du-souffle"
# Short Version Update
short_slug = "iluo-version-courte"

# I will use execute_sql directly for safer handling of JSON.
def get_sql_call(slug, title_json, content_json, summary_json):
    return f"UPDATE articles SET title = '{json.dumps(title_json)}'::jsonb, content = '{json.dumps(content_json).replace(\"'\", \"''\")}'::jsonb, summary = '{json.dumps(summary_json).replace(\"'\", \"''\")}'::jsonb WHERE slug = '{slug}';"

# Titles
long_titles = {
    "en": "Iluo: The Breath of the Invisible and the Command of the Doubles",
    "fr": "Iluo : Le Souffle de l'Invisible et le Commandement des Doubles",
    "lin": "Iluo: Mpema ya Nseka mpe Komanda ya ba Double",
    "skt": "Iluo: Mpema ya Nseka (Kisakata)",
    "swa": "Iluo: Pumzi ya Siri na Amri ya Kivuli",
    "tsh": "Iluo: Muuya wa Musokoko ne Bukokeshi bua Kivule"
}

print(json.dumps({
    "long_titles": long_titles,
    "summaries": summaries
}))
