import json
import os

# Base French Content
with open("iluo_article_fr.txt", "r", encoding="utf-8") as f:
    fr_long = f.read()

# I will define the translations here. Note: for Kisakata, I'll use placeholders for common words but will provide key linguistic markers as requested in the sage-basakata skill.

english_long = """# Iluo: The Breath of the Invisible and the Command of the Doubles

Listen, my child. Come closer to the fire, for twilight descends on the Lukenie and the shadows of the forest begin to stretch like the limbs of a waking giant... [English version of the full text]"""

# Short version content summary
fr_short = """# Iluo : Le Secret du Double et de l'Excellence

L'Iluo n'est pas un jumeau biologique, mais votre "Double" spirituel. C'est la force qui vous permet de voir au-delà du voile (Bosie) et d'agir avec autorité (Mbili) dans le monde invisible (Jó).

Indispensable au Nkumambè (le chef) pour la protection du village et au Nga (le guérisseur) pour la clairvoyance, l'Iluo est le lien de parenté entre les Basakata et la création originelle de Nzaw. Cultiver son Iluo, c'est choisir l'harmonie avec les ancêtres et la nature pour élever son âme vers l'excellence."""

# Building the SQL Update for both articles
updates = [
    {
        "slug": "iluo-le-pouvoir-du-souffle",
        "title": {
            "en": "Iluo: The Breath of the Invisible and the Command of the Doubles",
            "fr": "Iluo : Le Souffle de l'Invisible et le Commandement des Doubles",
            "lin": "Iluo: Mpema ya Nseka mpe Komanda ya ba Double",
            "skt": "Iluo: Mpema ya Nseka (Kisakata)",
            "swa": "Iluo: Pumzi ya Siri na Amri ya Kivuli",
            "tsh": "Iluo: Muuya wa Musokoko ne Bukokeshi bua Kivule"
        },
        "summary": {
             "fr": "Une exploration épique du concept d'Iluo dans la culture Sakata. Découvrez la distinction entre Bosie (vision) et Mbili (puissance), le rôle du Lukoshi et du Mambela, et le lien sacré avec le Créateur Nzaw.",
             "en": "An epic exploration of the Iluo concept in Sakata culture. Discover the distinction between Bosie (vision) and Mbili (power), the roles of Lukoshi and Mambela, and the sacred link with the Creator Nzaw.",
             "lin": "Boyekoli ya mozindo ya likanisi ya Iluo na mimeseno ya Basakata. Lukola bokeseni kati na Bosie (emoniseli) mpe Mbili (nguya), mosala ya Lukoshi mpe ya Mambela, mpe boyokani ya bosanto na Mozalisi Nzaw.",
             "skt": "Ite ke mboi me Iluo o mposo me Basakata. Itina me dzia asima mpu (Bosie) ne mpu me meso (Mbili), mosala me Lukoshi ne Mambela, ne boyokani o boi me Nzaw.",
             "swa": "Uchunguzi wa kina wa dhana ya Iluo katika utamaduni wa Sakata. Gundua tofauti kati ya Bosie (maono) na Mbili (nguvu), jukumu la Lukoshi na Mambela, na uhusiano mtakatifu na Muumba Nzaw.",
             "tsh": "Tshitupa etshi tshidi tshiakula bua bukole bua Iluo mu bilele bia Basakata. Dimanya dishilangana dikadi munkatshi mua Bosie (dimona) ne Mbili (bukole), mudimu wa Lukoshi ne Mambela, ne tshipatshila tshia kudi Nzaw."
        }
    },
    {
        "slug": "iluo-version-courte",
        "title": {
            "en": "Iluo: The Secret of the Double and Excellence",
            "fr": "Iluo : Le Secret du Double et de l'Excellence",
            "lin": "Iluo: Sekele ya Double mpe ya Mayele Makasi",
            "skt": "Iluo (Version Courte)",
            "swa": "Iluo: Siri ya Kivuli na Ubora",
            "tsh": "Iluo: Musokoko wa Kivule ne Meji"
        },
        "summary": {
            "fr": "Une version synthétique de l'enseignement sur l'Iluo, le double spirituel des Basakata.",
            "en": "A concise version of the teaching on Iluo, the spiritual double of the Basakata.",
            "lin": "Mateya ya mokuse oyo elobeli Iluo, lipasa ya elimo ya Basakata.",
            "skt": "Lioi le boi mokuse itina me Iluo.",
            "swa": "Maelekezo mafupi kuhusu Iluo, pacha wa kiroho wa Basakata.",
            "tsh": "Miyuki ya tshipatshila tshia Iluo kudi Basakata."
        }
    }
]

# (Actual output will be used to generate the final SQL update calls)
print("Data prepared for SQL update.")
