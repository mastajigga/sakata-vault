/**
 * Données du cours de langue Kisakata — 4 niveaux × 8 leçons = 32 leçons
 *
 * Chaque leçon contient :
 * - titre, description
 * - mots (kisakata, francais, phonetique, emoji)
 * - noteCulturelle (contexte ethnolinguistique)
 */

export interface MotKisakata {
  kisakata: string;
  francais: string;
  phonetique: string;
  emoji?: string;
}

export interface LeconData {
  slug: string;
  titre: string;
  description: string;
  noteCulturelle: string;
  mots: MotKisakata[];
}

export interface NiveauData {
  slug: string;
  nom: string;
  description: string;
  couleur: string;
  lecons: LeconData[];
}

export const NIVEAUX: NiveauData[] = [
  // ═══════════════════════════════════════
  // NIVEAU 1 — GOUTTE DE ROSÉE (Débutant)
  // ═══════════════════════════════════════
  {
    slug: "goutte-rosee",
    nom: "Goutte de Rosée",
    description: "Premiers sons, salutations, les membres de la famille.",
    couleur: "#C4A035",
    lecons: [
      {
        slug: "salutations",
        titre: "Salutations",
        description:
          "Les premiers mots que l'on échange au lever du jour. Apprenez à saluer comme on le fait au village.",
        noteCulturelle:
          "Chez les Basakata, la salutation n'est pas une simple formule : c'est un rituel. On prend le temps de demander des nouvelles de la famille, de la santé, du village. Une salutation trop rapide est impolie.",
        mots: [
          { kisakata: "Mbóte", francais: "Bonjour", phonetique: "m-BOH-teh", emoji: "👋" },
          { kisakata: "Tókó", francais: "Ça va / D'accord", phonetique: "TOH-koh", emoji: "👍" },
          { kisakata: "Lóbí", francais: "À demain / Salut", phonetique: "LOH-bee", emoji: "☀️" },
          { kisakata: "Bótámbólá", francais: "Bienvenue", phonetique: "boh-tam-BOH-lah", emoji: "🤗" },
          { kisakata: "Mélá míngi", francais: "Merci beaucoup", phonetique: "MEH-lah MEEN-ghee", emoji: "🙏" },
          { kisakata: "Nzéngá", francais: "Bonsoir", phonetique: "n-ZEN-gah", emoji: "🌙" },
        ],
      },
      {
        slug: "famille",
        titre: "La Famille",
        description:
          "Les liens sacrés du clan. Découvrez comment nommer chaque membre de la famille élargie.",
        noteCulturelle:
          "La famille Basakata est étendue : oncles, tantes, cousins sont considérés comme des pères, mères, frères et sœurs. Les grands-parents sont les gardiens de la mémoire. Nkókó désigne à la fois le grand-père et l'ancêtre.",
        mots: [
          { kisakata: "Tatá", francais: "Papa", phonetique: "tah-TAH", emoji: "👨" },
          { kisakata: "Mamá", francais: "Maman", phonetique: "mah-MAH", emoji: "👩" },
          { kisakata: "Nkókó", francais: "Grand-père / Ancêtre", phonetique: "n-KOH-koh", emoji: "👴" },
          { kisakata: "Kókó", francais: "Grand-mère", phonetique: "KOH-koh", emoji: "👵" },
          { kisakata: "Mwána", francais: "Enfant", phonetique: "MWAH-nah", emoji: "👶" },
          { kisakata: "Ndéko", francais: "Frère / Sœur", phonetique: "n-DEH-koh", emoji: "👫" },
        ],
      },
      {
        slug: "se-presenter",
        titre: "Se présenter",
        description:
          "Dire qui l'on est, d'où l'on vient. La première conversation complète.",
        noteCulturelle:
          "Se présenter chez les Basakata inclut toujours son village d'origine et son clan. 'Nkómbó na ngáí...' (Je m'appelle...) est souvent suivi de 'Naútí...' (Je viens de...). Le lieu fait partie de l'identité.",
        mots: [
          { kisakata: "Nkómbó", francais: "Nom", phonetique: "n-KOHM-boh", emoji: "📛" },
          { kisakata: "Ngáí", francais: "Moi / Je", phonetique: "n-GAH-ee", emoji: "🙋" },
          { kisakata: "Yó", francais: "Toi / Tu", phonetique: "YOH", emoji: "👉" },
          { kisakata: "Mbóka", francais: "Village", phonetique: "m-BOH-kah", emoji: "🏘️" },
          { kisakata: "Naútí", francais: "Je viens de...", phonetique: "nah-OO-tee", emoji: "📍" },
          { kisakata: "Éé", francais: "Oui", phonetique: "EH-eh", emoji: "✅" },
        ],
      },
      {
        slug: "nombres",
        titre: "Les Nombres",
        description:
          "De 1 à 6, les premiers chiffres pour compter comme au village.",
        noteCulturelle:
          "Le système de numération Basakata est décimal. On compte sur les doigts, et chaque nombre a une gestuelle. Les nombres sont essentiels au marché, pour les dots et dans les contes. 'Mókó' signifie à la fois 'un' et 'unité'.",
        mots: [
          { kisakata: "Mókó", francais: "Un (1)", phonetique: "MOH-koh", emoji: "1️⃣" },
          { kisakata: "Íbalé", francais: "Deux (2)", phonetique: "EE-bah-leh", emoji: "2️⃣" },
          { kisakata: "Ísátó", francais: "Trois (3)", phonetique: "EE-sah-toh", emoji: "3️⃣" },
          { kisakata: "Ínéí", francais: "Quatre (4)", phonetique: "EE-neh-ee", emoji: "4️⃣" },
          { kisakata: "Ítánó", francais: "Cinq (5)", phonetique: "EE-tah-noh", emoji: "5️⃣" },
          { kisakata: "Ísámbá", francais: "Six (6)", phonetique: "EE-sahm-bah", emoji: "6️⃣" },
        ],
      },
      {
        slug: "corps",
        titre: "Le Visage & le Corps",
        description:
          "Les parties du corps, pour apprendre à se connaître et à se soigner.",
        noteCulturelle:
          "Le corps est sacré chez les Basakata. Chaque partie a une signification symbolique : la tête (Mótú) est le siège de la sagesse, les yeux (Míso) sont les fenêtres de l'âme, le cœur (Motéma) est le centre des émotions. On ne touche pas la tête d'un aîné.",
        mots: [
          { kisakata: "Mótú", francais: "Tête", phonetique: "MOH-too", emoji: "🗣️" },
          { kisakata: "Míso", francais: "Yeux", phonetique: "MEE-soh", emoji: "👀" },
          { kisakata: "Motéma", francais: "Cœur", phonetique: "moh-TEH-mah", emoji: "❤️" },
          { kisakata: "Mabókó", francais: "Mains", phonetique: "mah-BOH-koh", emoji: "🤲" },
          { kisakata: "Makóló", francais: "Pieds", phonetique: "mah-KOH-loh", emoji: "🦶" },
          { kisakata: "Lolému", francais: "Langue", phonetique: "loh-LEH-moo", emoji: "👅" },
        ],
      },
      {
        slug: "animaux",
        titre: "Les Animaux de la Forêt",
        description:
          "Les créatures qui peuplent la Zámba (forêt) et la vie quotidienne.",
        noteCulturelle:
          "Les animaux occupent une place centrale dans les contes et la cosmologie Basakata. Le léopard (Nkóyí) est le roi de la forêt, symbole de puissance. Le perroquet (Nkósó) est le messager. Chaque animal a son caractère dans les fables.",
        mots: [
          { kisakata: "Nkóyí", francais: "Léopard", phonetique: "n-KOH-yee", emoji: "🐆" },
          { kisakata: "Nkósó", francais: "Perroquet", phonetique: "n-KOH-soh", emoji: "🦜" },
          { kisakata: "Mbwá", francais: "Chien", phonetique: "m-BWAH", emoji: "🐕" },
          { kisakata: "Niama", francais: "Animal / Bête", phonetique: "nee-AH-mah", emoji: "🐾" },
          { kisakata: "Nsósó", francais: "Poulet / Poule", phonetique: "n-SOH-soh", emoji: "🐓" },
          { kisakata: "Mbísi", francais: "Poisson", phonetique: "m-BEE-see", emoji: "🐟" },
        ],
      },
      {
        slug: "boire-manger",
        titre: "Boire & Manger",
        description:
          "Les premiers mots pour partager un repas et demander à boire.",
        noteCulturelle:
          "Partager la nourriture est un acte sacré. On ne refuse jamais à boire à un visiteur. L'eau (Mái) est la vie. Avant de manger, on verse quelques gouttes par terre pour les ancêtres. Le repas se prend souvent dans une grande assiette commune.",
        mots: [
          { kisakata: "Kolía", francais: "Manger", phonetique: "koh-LEE-ah", emoji: "🍽️" },
          { kisakata: "Koméla", francais: "Boire", phonetique: "koh-MEH-lah", emoji: "🥤" },
          { kisakata: "Mái", francais: "Eau", phonetique: "MAH-ee", emoji: "💧" },
          { kisakata: "Bilía", francais: "Nourriture", phonetique: "bee-LEE-ah", emoji: "🍲" },
          { kisakata: "Nzala", francais: "Faim", phonetique: "n-ZAH-lah", emoji: "😋" },
          { kisakata: "Mposa", francais: "Soif", phonetique: "m-POH-sah", emoji: "🥵" },
        ],
      },
      {
        slug: "questions",
        titre: "Questions Simples",
        description:
          "Les premiers mots pour comprendre et se faire comprendre.",
        noteCulturelle:
          "Poser des questions est un art. On commence toujours par s'enquérir de la santé avant d'aborder un sujet. 'Ndenge níni?' (Comment?) est une question ouverte qui invite au dialogue. Le ton montant en fin de phrase signale l'interrogation.",
        mots: [
          { kisakata: "Náni?", francais: "Qui ?", phonetique: "NAH-nee", emoji: "❓" },
          { kisakata: "Níni?", francais: "Quoi ?", phonetique: "NEE-nee", emoji: "❔" },
          { kisakata: "Wápi?", francais: "Où ?", phonetique: "WAH-pee", emoji: "📍" },
          { kisakata: "Ntángo níni?", francais: "Quand ?", phonetique: "n-TAHN-goh NEE-nee", emoji: "⏰" },
          { kisakata: "Ndenge níni?", francais: "Comment ?", phonetique: "n-DEN-geh NEE-nee", emoji: "🤔" },
          { kisakata: "Té", francais: "Non / Pas", phonetique: "TEH", emoji: "❌" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // NIVEAU 2 — RUISSEAU (Élémentaire)
  // ═══════════════════════════════════════
  {
    slug: "ruisseau",
    nom: "Ruisseau",
    description: "Phrases simples, couleurs, chiffres, aliments.",
    couleur: "#B59551",
    lecons: [
      {
        slug: "nourriture",
        titre: "La Nourriture",
        description:
          "Les aliments du terroir Sakata. De la banane plantain au poisson frais de la Lukenie.",
        noteCulturelle:
          "La cuisine Basakata repose sur le mákémbá (banane plantain), le mbísi (poisson), le nsósó (poulet), et les légumes-feuilles. Le repas est un moment sacré de partage. On mange souvent avec les doigts, dans une grande assiette commune.",
        mots: [
          { kisakata: "Mákémbá", francais: "Bananes plantains", phonetique: "MAH-kem-bah", emoji: "🍌" },
          { kisakata: "Mbísi", francais: "Poisson", phonetique: "m-BEE-see", emoji: "🐟" },
          { kisakata: "Nsósó", francais: "Poulet", phonetique: "n-SOH-soh", emoji: "🍗" },
          { kisakata: "Mái", francais: "Eau", phonetique: "MAH-ee", emoji: "💧" },
          { kisakata: "Ntóndó", francais: "Manioc", phonetique: "n-TOHN-doh", emoji: "🥔" },
          { kisakata: "Kolía", francais: "Manger", phonetique: "koh-LEE-ah", emoji: "🍽️" },
        ],
      },
      {
        slug: "couleurs",
        titre: "Les Couleurs",
        description:
          "La palette Sakata : des couleurs de la forêt, de la terre et du ciel.",
        noteCulturelle:
          "Les couleurs en Kisakata sont souvent liées à des éléments naturels. 'Ntáne' (rouge) évoque la terre latéritique. 'Mbwé' (blanc) est la couleur des esprits et de la paix. Certaines couleurs ont une signification rituelle.",
        mots: [
          { kisakata: "Ntáne", francais: "Rouge", phonetique: "n-TAH-neh", emoji: "🔴" },
          { kisakata: "Mbwé", francais: "Blanc", phonetique: "m-BWEH", emoji: "⚪" },
          { kisakata: "Ngóla", francais: "Noir", phonetique: "n-GOH-lah", emoji: "⚫" },
          { kisakata: "Zámba", francais: "Vert (forêt)", phonetique: "ZAHM-bah", emoji: "🟢" },
          { kisakata: "Nkómbé", francais: "Bleu", phonetique: "n-KOHM-beh", emoji: "🔵" },
          { kisakata: "Mosé", francais: "Jaune / Or", phonetique: "moh-SEH", emoji: "🟡" },
        ],
      },
      {
        slug: "compter",
        titre: "Compter en Kisakata",
        description:
          "Les nombres de 7 à 20, pour compter comme on compte au marché de la rivière.",
        noteCulturelle:
          "Après 6, les nombres se construisent de façon additive. Compter est essentiel au marché. Les jours du marché suivent un cycle de 4 jours, chaque jour ayant un nom. Les nombres sont souvent accompagnés d'un geste des doigts.",
        mots: [
          { kisakata: "Nsámbó", francais: "Sept (7)", phonetique: "n-SAHM-boh", emoji: "7️⃣" },
          { kisakata: "Mwámbé", francais: "Huit (8)", phonetique: "MWAHM-beh", emoji: "8️⃣" },
          { kisakata: "Libwá", francais: "Neuf (9)", phonetique: "lee-BWAH", emoji: "9️⃣" },
          { kisakata: "Zómi", francais: "Dix (10)", phonetique: "ZOH-mee", emoji: "🔟" },
          { kisakata: "Zómi na mókó", francais: "Onze (11)", phonetique: "ZOH-mee nah MOH-koh", emoji: "1️⃣1️⃣" },
          { kisakata: "Ntúkú íbalé", francais: "Vingt (20)", phonetique: "n-TOO-koo EE-bah-leh", emoji: "2️⃣0️⃣" },
        ],
      },
      {
        slug: "maison",
        titre: "La Maison & le Village",
        description:
          "Les espaces du quotidien : la case, la cour, le foyer.",
        noteCulturelle:
          "La maison traditionnelle Basakata (Ndáko) est rectangulaire, en terre battue et toit de chaume. La cuisine est souvent une case séparée. Le village (Mbóka) s'organise autour de la place centrale où se tiennent les palabres. La porte est toujours ouverte.",
        mots: [
          { kisakata: "Ndáko", francais: "Maison / Case", phonetique: "n-DAH-koh", emoji: "🏠" },
          { kisakata: "Ekuke", francais: "Porte", phonetique: "eh-KOO-keh", emoji: "🚪" },
          { kisakata: "Móto", francais: "Feu / Foyer", phonetique: "MOH-toh", emoji: "🔥" },
          { kisakata: "Mbéto", francais: "Lit / Natte", phonetique: "m-BEH-toh", emoji: "🛏️" },
          { kisakata: "Libúlú", francais: "Cuisine (case)", phonetique: "lee-BOO-loo", emoji: "🍳" },
          { kisakata: "Lobála", francais: "Cour / Enclos", phonetique: "loh-BAH-lah", emoji: "🏡" },
        ],
      },
      {
        slug: "vetements",
        titre: "Les Vêtements",
        description:
          "Ce que l'on porte, du pagne traditionnel aux tissus du marché.",
        noteCulturelle:
          "Le pagne (Lipúta) est le vêtement traditionnel, porté par les hommes et les femmes. Les motifs et couleurs varient selon les occasions. Le raphia tissé (Mabéle) sert pour les cérémonies. Aujourd'hui, on mélange vêtements modernes et traditionnels.",
        mots: [
          { kisakata: "Lipúta", francais: "Pagne / Tissu", phonetique: "lee-POO-tah", emoji: "👘" },
          { kisakata: "Mabéle", francais: "Raphia tissé", phonetique: "mah-BEH-leh", emoji: "🧵" },
          { kisakata: "Ekótó", francais: "Chapeau", phonetique: "eh-KOH-toh", emoji: "🎩" },
          { kisakata: "Sapáto", francais: "Chaussures", phonetique: "sah-PAH-toh", emoji: "👞" },
          { kisakata: "Koláta", francais: "S'habiller / Porter", phonetique: "koh-LAH-tah", emoji: "👔" },
          { kisakata: "Kítókó", francais: "Beau / Joli", phonetique: "KEE-toh-koh", emoji: "✨" },
        ],
      },
      {
        slug: "meteo",
        titre: "La Météo & les Saisons",
        description:
          "Le ciel, la pluie, le soleil — le climat qui rythme la vie.",
        noteCulturelle:
          "Il y a deux saisons principales : la saison des pluies (Mbúla) et la saison sèche (Loké). La pluie est bénie car elle nourrit les cultures. Le tonnerre (Nkáké) est la voix des ancêtres. On consulte le ciel avant chaque activité.",
        mots: [
          { kisakata: "Mbúla", francais: "Pluie / Saison des pluies", phonetique: "m-BOO-lah", emoji: "🌧️" },
          { kisakata: "Mói", francais: "Soleil", phonetique: "moh-EE", emoji: "☀️" },
          { kisakata: "Loké", francais: "Saison sèche", phonetique: "loh-KEH", emoji: "🏜️" },
          { kisakata: "Nkáké", francais: "Tonnerre", phonetique: "n-KAH-keh", emoji: "⛈️" },
          { kisakata: "Mopépé", francais: "Vent", phonetique: "moh-PEH-peh", emoji: "💨" },
          { kisakata: "Malíli", francais: "Froid", phonetique: "mah-LEE-lee", emoji: "🥶" },
        ],
      },
      {
        slug: "sentiments",
        titre: "Les Sentiments",
        description:
          "Exprimer ce que l'on ressent : joie, tristesse, amour, peur.",
        noteCulturelle:
          "Les émotions s'expriment avec pudeur mais profondeur. La joie se danse, la tristesse se partage en communauté. 'Bosémbo' (joie) est le but de la vie. Les anciens disent que le cœur (Motéma) ne ment jamais, même quand la bouche se tait.",
        mots: [
          { kisakata: "Bosémbo", francais: "Joie / Bonheur", phonetique: "boh-SEM-boh", emoji: "😊" },
          { kisakata: "Elingí", francais: "Amour", phonetique: "eh-leen-GEE", emoji: "❤️" },
          { kisakata: "Mawa", francais: "Tristesse / Peine", phonetique: "MAH-wah", emoji: "😢" },
          { kisakata: "Bobángi", francais: "Peur", phonetique: "boh-BAHN-gee", emoji: "😨" },
          { kisakata: "Nkándá", francais: "Colère", phonetique: "n-KAHN-dah", emoji: "😤" },
          { kisakata: "Kosépela", francais: "Être content", phonetique: "koh-SEH-peh-lah", emoji: "🥰" },
        ],
      },
      {
        slug: "marche",
        titre: "Au Marché",
        description:
          "Acheter, vendre, marchander — la vie économique du village.",
        noteCulturelle:
          "Le marché est le cœur battant du village. On y va pour tout : nourriture, tissus, nouvelles. Le marchandage est un art et un jeu social. Refuser de marchander est presque impoli. Les jours de marché rythment la semaine.",
        mots: [
          { kisakata: "Zándo", francais: "Marché", phonetique: "ZAHN-doh", emoji: "🏪" },
          { kisakata: "Kosómba", francais: "Acheter", phonetique: "koh-SOHM-bah", emoji: "🛒" },
          { kisakata: "Kotéka", francais: "Vendre", phonetique: "koh-TEH-kah", emoji: "💰" },
          { kisakata: "Mbóngo", francais: "Argent", phonetique: "m-BOHN-goh", emoji: "💵" },
          { kisakata: "Ntálo", francais: "Prix / Valeur", phonetique: "n-TAH-loh", emoji: "🏷️" },
          { kisakata: "Míngi", francais: "Beaucoup", phonetique: "MEEN-ghee", emoji: "📊" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // NIVEAU 3 — RIVIÈRE (Intermédiaire)
  // ═══════════════════════════════════════
  {
    slug: "riviere",
    nom: "Rivière",
    description: "Conversations, temps, lieux, actions quotidiennes.",
    couleur: "#E9C46A",
    lecons: [
      {
        slug: "actions",
        titre: "Actions & Verbes",
        description:
          "Les verbes du quotidien : marcher, manger, dormir, parler.",
        noteCulturelle:
          "En Kisakata, les verbes sont le cœur de la phrase. Ils portent les marques de temps et d'aspect via des préfixes. 'Ko-' est le préfixe de l'infinitif (kotámbola = marcher). La conjugaison se fait en changeant ce préfixe.",
        mots: [
          { kisakata: "Kotámbola", francais: "Marcher", phonetique: "koh-TAHM-boh-lah", emoji: "🚶" },
          { kisakata: "Kolía", francais: "Manger", phonetique: "koh-LEE-ah", emoji: "🍽️" },
          { kisakata: "Kolála", francais: "Dormir", phonetique: "koh-LAH-lah", emoji: "😴" },
          { kisakata: "Koloba", francais: "Parler", phonetique: "koh-LOH-bah", emoji: "🗣️" },
          { kisakata: "Koyóka", francais: "Écouter / Comprendre", phonetique: "koh-YOH-kah", emoji: "👂" },
          { kisakata: "Komóna", francais: "Voir", phonetique: "koh-MOH-nah", emoji: "👁️" },
        ],
      },
      {
        slug: "temps",
        titre: "Le Temps",
        description:
          "Hier, aujourd'hui, demain — se repérer dans le temps qui coule comme la rivière.",
        noteCulturelle:
          "La conception du temps chez les Basakata est cyclique, liée aux saisons, aux crues de la Lukenie, aux cycles agricoles. 'Lóbí' peut signifier à la fois 'demain' et 'hier' selon le contexte tonal. Le temps n'est pas une ligne droite mais un cercle.",
        mots: [
          { kisakata: "Lóbí", francais: "Demain / Hier", phonetique: "LOH-bee", emoji: "📅" },
          { kisakata: "Lélo", francais: "Aujourd'hui", phonetique: "LEH-loh", emoji: "☀️" },
          { kisakata: "Ntángo", francais: "Temps / Moment", phonetique: "n-TAHN-goh", emoji: "⏰" },
          { kisakata: "Mokóló", francais: "Jour", phonetique: "moh-KOH-loh", emoji: "🌅" },
          { kisakata: "Butú", francais: "Nuit", phonetique: "boo-TOO", emoji: "🌃" },
          { kisakata: "Siká", francais: "Maintenant", phonetique: "see-KAH", emoji: "⚡" },
        ],
      },
      {
        slug: "lieux",
        titre: "Lieux & Nature",
        description:
          "La forêt, la rivière, le village — les espaces sacrés du territoire Sakata.",
        noteCulturelle:
          "Pour les Basakata, la nature n'est pas un décor mais un partenaire. La Zámba (forêt) est vivante, habitée par les esprits. L'Ebale (rivière) est la source de vie. Chaque lieu a son génie protecteur. On ne traverse pas une forêt sans saluer ses gardiens.",
        mots: [
          { kisakata: "Zámba", francais: "Forêt", phonetique: "ZAHM-bah", emoji: "🌳" },
          { kisakata: "Ebale", francais: "Rivière", phonetique: "eh-BAH-leh", emoji: "🌊" },
          { kisakata: "Mbóka", francais: "Village", phonetique: "m-BOH-kah", emoji: "🏘️" },
          { kisakata: "Ndáko", francais: "Maison", phonetique: "n-DAH-koh", emoji: "🏠" },
          { kisakata: "Nkéli", francais: "Route / Chemin", phonetique: "n-KEH-lee", emoji: "🛤️" },
          { kisakata: "Likoló", francais: "Ciel / En haut", phonetique: "lee-koh-LOH", emoji: "☁️" },
        ],
      },
      {
        slug: "conversation",
        titre: "La Conversation",
        description:
          "Tenir une discussion complète : saluer, échanger, prendre congé.",
        noteCulturelle:
          "Une conversation Basakata suit un rituel : on salue, on prend des nouvelles de la famille, on échange les nouvelles du village, puis on aborde le sujet. On ne coupe jamais la parole à un aîné. Le silence entre les phrases est respecté, il laisse la parole mûrir.",
        mots: [
          { kisakata: "Sángo níni?", francais: "Quelles nouvelles ?", phonetique: "SAHN-goh NEE-nee", emoji: "📰" },
          { kisakata: "Malámu", francais: "Bien / Bon", phonetique: "mah-LAH-moo", emoji: "👌" },
          { kisakata: "Nakoyóka", francais: "Je comprends", phonetique: "nah-koh-YOH-kah", emoji: "💡" },
          { kisakata: "Tíkala malámu", francais: "Porte-toi bien (au revoir)", phonetique: "TEE-kah-lah mah-LAH-moo", emoji: "👋" },
          { kisakata: "Lotómo", francais: "Respect / Honneur", phonetique: "loh-TOH-moh", emoji: "🙇" },
          { kisakata: "Lisángá", francais: "Réunion / Assemblée", phonetique: "lee-SAHN-gah", emoji: "👥" },
        ],
      },
      {
        slug: "metiers",
        titre: "Les Métiers & Savoir-faire",
        description:
          "Pêcheur, forgeron, tisserand — les artisans du quotidien.",
        noteCulturelle:
          "Chaque métier est un héritage. Le forgeron (Motúlí) est respecté car il maîtrise le feu et le fer. Le pêcheur (Molóbi) connaît la rivière comme personne. La potière façonne l'argile en chantant. Les savoir-faire se transmettent de génération en génération.",
        mots: [
          { kisakata: "Motúlí", francais: "Forgeron", phonetique: "moh-TOO-lee", emoji: "⚒️" },
          { kisakata: "Molóbi", francais: "Pêcheur", phonetique: "moh-LOH-bee", emoji: "🎣" },
          { kisakata: "Molóni", francais: "Tisserand", phonetique: "moh-LOH-nee", emoji: "🧶" },
          { kisakata: "Mokéli", francais: "Potier / Potière", phonetique: "moh-KEH-lee", emoji: "🏺" },
          { kisakata: "Mosáli", francais: "Travailleur / Ouvrier", phonetique: "moh-SAH-lee", emoji: "👷" },
          { kisakata: "Kosála", francais: "Travailler / Faire", phonetique: "koh-SAH-lah", emoji: "🔧" },
        ],
      },
      {
        slug: "ceremonies",
        titre: "Cérémonies & Fêtes",
        description:
          "Mariages, naissances, deuils — les grands moments de la vie communautaire.",
        noteCulturelle:
          "Les cérémonies rythment la vie : le mariage (Libála) dure plusieurs jours avec dot, danses et festins. La naissance est célébrée par des chants. Les funérailles (Matánga) sont le moment où la communauté se rassemble pour accompagner l'âme du défunt.",
        mots: [
          { kisakata: "Libála", francais: "Mariage", phonetique: "lee-BAH-lah", emoji: "💒" },
          { kisakata: "Matánga", francais: "Funérailles / Deuil", phonetique: "mah-TAHN-gah", emoji: "🕯️" },
          { kisakata: "Mabína", francais: "Danse / Fête", phonetique: "mah-BEE-nah", emoji: "💃" },
          { kisakata: "Bokwé", francais: "Dot", phonetique: "boh-KWEH", emoji: "💍" },
          { kisakata: "Bobótami", francais: "Naissance", phonetique: "boh-BOH-tah-mee", emoji: "👶" },
          { kisakata: "Mokéli", francais: "Créateur / Dieu", phonetique: "moh-KEH-lee", emoji: "🙏" },
        ],
      },
      {
        slug: "voyager",
        titre: "Voyager",
        description:
          "Se déplacer entre villages, sur la rivière, à travers la forêt.",
        noteCulturelle:
          "Voyager fait partie de la vie. On se déplace en pirogue (Bwátu) sur la rivière, à pied dans la forêt. Chaque déplacement est précédé d'une bénédiction. On salue chaque village traversé. Le voyageur est toujours bien accueilli.",
        mots: [
          { kisakata: "Bwátu", francais: "Pirogue", phonetique: "BWAH-too", emoji: "🛶" },
          { kisakata: "Nkéli", francais: "Chemin / Route", phonetique: "n-KEH-lee", emoji: "🛤️" },
          { kisakata: "Mobémbó", francais: "Voyage", phonetique: "moh-BEM-boh", emoji: "🧳" },
          { kisakata: "Kokéndé", francais: "Partir / Aller", phonetique: "koh-KEN-deh", emoji: "🚶" },
          { kisakata: "Koyá", francais: "Venir / Arriver", phonetique: "koh-YAH", emoji: "🏁" },
          { kisakata: "Mosíká", francais: "Loin", phonetique: "moh-SEE-kah", emoji: "🗺️" },
        ],
      },
      {
        slug: "raconter",
        titre: "Raconter sa Journée",
        description:
          "Décrire ce que l'on a fait, du matin au soir.",
        noteCulturelle:
          "Le soir, autour du feu, chacun raconte sa journée. C'est le moment où les enfants apprennent à parler en public. On commence par 'Lélo...' (Aujourd'hui...). Les anciens écoutent et commentent. C'est l'école de la vie.",
        mots: [
          { kisakata: "Ntóngó", francais: "Matin", phonetique: "n-TOHN-goh", emoji: "🌅" },
          { kisakata: "Mpókwa", francais: "Soir", phonetique: "m-POH-kwah", emoji: "🌆" },
          { kisakata: "Kosukola", francais: "Se laver", phonetique: "koh-soo-KOH-lah", emoji: "🚿" },
          { kisakata: "Koyángela", francais: "Préparer / Organiser", phonetique: "koh-YAHN-geh-lah", emoji: "📋" },
          { kisakata: "Kopéma", francais: "Se reposer", phonetique: "koh-PEH-mah", emoji: "😌" },
          { kisakata: "Kozónga", francais: "Revenir / Retourner", phonetique: "koh-ZOHN-gah", emoji: "↩️" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // NIVEAU 4 — LUKENIE (Avancé)
  // ═══════════════════════════════════════
  {
    slug: "lukenie",
    nom: "Lukenie",
    description: "Récits, proverbes, narration, langue soutenue.",
    couleur: "#E8C670",
    lecons: [
      {
        slug: "proverbes",
        titre: "Proverbes",
        description:
          "La sagesse des anciens condensée en une phrase. Chaque proverbe est une leçon de vie.",
        noteCulturelle:
          "Les proverbes Basakata (Masese) sont le pilier de l'éducation traditionnelle. Ils s'utilisent dans les palabres, les conseils de famille, et les cérémonies. Un bon orateur est celui qui sait placer le bon proverbe au bon moment.",
        mots: [
          { kisakata: "Ebale eké mokémbá", francais: "La rivière n'oublie pas sa source", phonetique: "eh-BAH-leh eh-KEH moh-KEM-bah", emoji: "🌊" },
          { kisakata: "Nkókó akúfí, maloba maké", francais: "L'ancêtre est parti, mais ses paroles restent", phonetique: "n-KOH-koh ah-KOO-fee, mah-LOH-bah mah-KEH", emoji: "💭" },
          { kisakata: "Lobóko lókó loké kolála", francais: "Un seul bras ne suffit pas pour dormir (l'union fait la force)", phonetique: "loh-BOH-koh LOH-koh loh-KEH koh-LAH-lah", emoji: "🤝" },
          { kisakata: "Mái ma mbúla maké kosíla", francais: "L'eau de pluie ne finit jamais (la connaissance est infinie)", phonetique: "MAH-ee mah m-BOO-lah mah-KEH koh-SEE-lah", emoji: "💧" },
          { kisakata: "Zámba íbale míbalé", francais: "Deux forêts ne se ressemblent pas", phonetique: "ZAHM-bah EE-bah-leh MEE-bah-leh", emoji: "🌳" },
        ],
      },
      {
        slug: "recits",
        titre: "Récits",
        description:
          "Raconter une histoire en Kisakata. Les connecteurs narratifs et le passé.",
        noteCulturelle:
          "Les récits (Masapo) se racontent le soir, autour du feu. Ils commencent souvent par 'Kala kala...' (Il était une fois...). L'auditoire répond 'Mókó' pour montrer qu'il écoute. Le conteur utilise des gestes, des chants, et fait participer l'assistance.",
        mots: [
          { kisakata: "Kala kala", francais: "Il était une fois", phonetique: "KAH-lah KAH-lah", emoji: "📖" },
          { kisakata: "Mókó", francais: "Oui, j'écoute (réponse rituelle)", phonetique: "MOH-koh", emoji: "👂" },
          { kisakata: "Ntángo ína", francais: "À ce moment-là", phonetique: "n-TAHN-goh EE-nah", emoji: "⏳" },
          { kisakata: "Na síma", francais: "Ensuite / Après", phonetique: "nah SEE-mah", emoji: "➡️" },
          { kisakata: "Ekosíla", francais: "C'est fini (fin du conte)", phonetique: "eh-koh-SEE-lah", emoji: "🏁" },
          { kisakata: "Lisapo", francais: "Conte / Histoire", phonetique: "lee-SAH-poh", emoji: "📚" },
        ],
      },
      {
        slug: "chant",
        titre: "Chants & Poésie",
        description:
          "Le rythme et la musicalité de la langue. Chanter comme on chante au bord de l'eau.",
        noteCulturelle:
          "La musique Basakata est inséparable de la langue. Les chants rythment le travail aux champs, les cérémonies, les veillées funéraires. Le rythme est souvent donné par le tam-tam (Ngóma). La voix monte et descend comme la rivière.",
        mots: [
          { kisakata: "Loyémbo", francais: "Chant / Chanson", phonetique: "loh-YEM-boh", emoji: "🎵" },
          { kisakata: "Ngóma", francais: "Tam-tam / Tambour", phonetique: "n-GOH-mah", emoji: "🥁" },
          { kisakata: "Koyémba", francais: "Chanter", phonetique: "koh-YEM-bah", emoji: "🎤" },
          { kisakata: "Mabína", francais: "Danse", phonetique: "mah-BEE-nah", emoji: "💃" },
          { kisakata: "Bosémbo", francais: "Joie / Bonheur", phonetique: "boh-SEM-boh", emoji: "😊" },
          { kisakata: "Elingí", francais: "Amour", phonetique: "eh-leen-GEE", emoji: "❤️" },
        ],
      },
      {
        slug: "sagesse",
        titre: "La Sagesse des Anciens",
        description:
          "Les paroles qui traversent les générations. Le vocabulaire du conseil et de la transmission.",
        noteCulturelle:
          "Les anciens (Bakókó) sont les bibliothèques vivantes du peuple. Leur parole a force de loi. Le conseil de famille (Lisángá) se réunit sous l'arbre à palabres. Un jeune ne parle pas avant qu'on l'y invite. La sagesse se reçoit, elle ne se prend pas.",
        mots: [
          { kisakata: "Bakókó", francais: "Les Ancêtres / Anciens", phonetique: "bah-KOH-koh", emoji: "🧓" },
          { kisakata: "Litéya", francais: "Enseignement / Leçon", phonetique: "lee-TEH-yah", emoji: "📜" },
          { kisakata: "Bwányá", francais: "Sagesse / Intelligence", phonetique: "BWAH-nyah", emoji: "🦉" },
          { kisakata: "Libosó", francais: "Conseil / Avis", phonetique: "lee-BOH-soh", emoji: "💬" },
          { kisakata: "Kokúmisa", francais: "Honorer / Respecter", phonetique: "koh-KOO-mee-sah", emoji: "🙏" },
          { kisakata: "Liséki", francais: "Héritage / Patrimoine", phonetique: "lee-SEH-kee", emoji: "🏛️" },
        ],
      },
      {
        slug: "croyances",
        titre: "Les Esprits & Croyances",
        description:
          "Le monde invisible : ancêtres, esprits de la nature, protection.",
        noteCulturelle:
          "Le monde Basakata est peuplé d'esprits. Les ancêtres (Bakókó) veillent sur les vivants. Chaque forêt, rivière, arbre sacré a son génie (Elímá). On fait des offrandes pour apaiser les esprits. Le guérisseur (Ngánga) est l'intermédiaire entre les mondes.",
        mots: [
          { kisakata: "Elímá", francais: "Esprit / Génie", phonetique: "eh-LEE-mah", emoji: "👻" },
          { kisakata: "Ngánga", francais: "Guérisseur / Devin", phonetique: "n-GAHN-gah", emoji: "🔮" },
          { kisakata: "Bokiló", francais: "Protection / Bénédiction", phonetique: "boh-KEE-loh", emoji: "🛡️" },
          { kisakata: "Molímo", francais: "Âme / Souffle", phonetique: "moh-LEE-moh", emoji: "💨" },
          { kisakata: "Libénga", francais: "Offrande / Sacrifice", phonetique: "lee-BEN-gah", emoji: "🎁" },
          { kisakata: "Ndóki", francais: "Sorcellerie / Magie", phonetique: "n-DOH-kee", emoji: "🪄" },
        ],
      },
      {
        slug: "plantes",
        titre: "Guérir & les Plantes",
        description:
          "La pharmacopée de la forêt. Les plantes qui soignent le corps et l'esprit.",
        noteCulturelle:
          "La forêt est la pharmacie des Basakata. Chaque plante a une vertu. Le Ngánga (guérisseur) connaît des centaines de remèdes. La transmission de ce savoir est secrète, de maître à disciple. Certaines plantes sont si sacrées qu'on ne prononce leur nom qu'à voix basse.",
        mots: [
          { kisakata: "Nkéngé", francais: "Plante médicinale", phonetique: "n-KEN-geh", emoji: "🌿" },
          { kisakata: "Kobéla", francais: "Maladie / Être malade", phonetique: "koh-BEH-lah", emoji: "🤒" },
          { kisakata: "Kobíkisa", francais: "Guérir / Sauver", phonetique: "koh-BEE-kee-sah", emoji: "💊" },
          { kisakata: "Nzeté", francais: "Arbre", phonetique: "n-ZEH-teh", emoji: "🌳" },
          { kisakata: "Nkásá", francais: "Feuille", phonetique: "n-KAH-sah", emoji: "🍃" },
          { kisakata: "Mpótó", francais: "Racine", phonetique: "m-POH-toh", emoji: "🪵" },
        ],
      },
      {
        slug: "conseil",
        titre: "La Parole du Conseil",
        description:
          "Le vocabulaire du débat, de l'argumentation et de la décision collective.",
        noteCulturelle:
          "Le conseil (Lisángá) est l'institution centrale. On y débat sous l'arbre à palabres. Chacun parle à son tour, du plus jeune au plus âgé. Les décisions se prennent par consensus. La parole donnée est sacrée. Un ancien qui ment perd son honneur à jamais.",
        mots: [
          { kisakata: "Lisángá", francais: "Conseil / Assemblée", phonetique: "lee-SAHN-gah", emoji: "🏛️" },
          { kisakata: "Liloba", francais: "Parole / Mot", phonetique: "lee-LOH-bah", emoji: "🗣️" },
          { kisakata: "Bosémbo", francais: "Vérité / Justice", phonetique: "boh-SEM-boh", emoji: "⚖️" },
          { kisakata: "Boyókani", francais: "Accord / Entente", phonetique: "boh-YOH-kah-nee", emoji: "🤝" },
          { kisakata: "Ndíngá", francais: "Langue / Voix", phonetique: "n-DEEN-gah", emoji: "🔊" },
          { kisakata: "Mobéko", francais: "Loi / Règle", phonetique: "moh-BEH-koh", emoji: "📋" },
        ],
      },
      {
        slug: "benedictions",
        titre: "Bénédictions & Souhaits",
        description:
          "Les formules sacrées pour bénir, souhaiter, protéger.",
        noteCulturelle:
          "Les bénédictions (Bokiló) sont des paroles puissantes. Un aîné qui bénit pose la main sur la tête. Les souhaits s'expriment avec des formules rituelles. 'Nkókó bátála yó' (Que les ancêtres te regardent) est la plus belle des bénédictions. La parole crée la réalité.",
        mots: [
          { kisakata: "Bokiló", francais: "Bénédiction", phonetique: "boh-KEE-loh", emoji: "🙌" },
          { kisakata: "Nkókó bátála yó", francais: "Que les ancêtres te regardent", phonetique: "n-KOH-koh BAH-tah-lah YOH", emoji: "👁️" },
          { kisakata: "Mái ma bomói", francais: "Eau de vie", phonetique: "MAH-ee mah boh-MOH-ee", emoji: "💧" },
          { kisakata: "Bobótami bolámu", francais: "Bonne naissance (félicitations)", phonetique: "boh-BOH-tah-mee boh-LAH-moo", emoji: "🎉" },
          { kisakata: "Nkéli elámu", francais: "Bon voyage / Bonne route", phonetique: "n-KEH-lee eh-LAH-moo", emoji: "🛤️" },
          { kisakata: "Káka bosémbo", francais: "Seulement la paix", phonetique: "KAH-kah boh-SEM-boh", emoji: "🕊️" },
        ],
      },
    ],
  },
];

/** Index plat pour lookup rapide */
export function getLecon(niveauSlug: string, leconSlug: string): LeconData | null {
  const niveau = NIVEAUX.find((n) => n.slug === niveauSlug);
  if (!niveau) return null;
  return niveau.lecons.find((l) => l.slug === leconSlug) || null;
}

export function getNiveau(slug: string): NiveauData | null {
  return NIVEAUX.find((n) => n.slug === slug) || null;
}
