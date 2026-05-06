/**
 * Données du cours de langue Kisakata — 4 niveaux × 3 leçons = 12 leçons
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
    ],
  },
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
        slug: "nombres",
        titre: "Compter en Kisakata",
        description:
          "Les nombres de 1 à 10, pour compter comme on compte au marché de la rivière.",
        noteCulturelle:
          "Le système de numération Basakata est décimal (base 10). Les nombres sont souvent accompagnés d'un geste des doigts. Compter est essentiel au marché, pour les dots (mariage), et dans les contes.",
        mots: [
          { kisakata: "Mókó", francais: "Un (1)", phonetique: "MOH-koh", emoji: "1️⃣" },
          { kisakata: "Íbalé", francais: "Deux (2)", phonetique: "EE-bah-leh", emoji: "2️⃣" },
          { kisakata: "Ísátó", francais: "Trois (3)", phonetique: "EE-sah-toh", emoji: "3️⃣" },
          { kisakata: "Ínéí", francais: "Quatre (4)", phonetique: "EE-neh-ee", emoji: "4️⃣" },
          { kisakata: "Ítánó", francais: "Cinq (5)", phonetique: "EE-tah-noh", emoji: "5️⃣" },
          { kisakata: "Ísámbá", francais: "Six (6)", phonetique: "EE-sahm-bah", emoji: "6️⃣" },
        ],
      },
    ],
  },
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
    ],
  },
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
          "Les proverbes Basakata (Masese) sont le pilier de l'éducation traditionnelle. Ils s'utilisent dans les palabres, les conseils de famille, et les cérémonies. Un bon orateur est celui qui sait placer le bon proverbe au bon moment. Ils sont souvent métaphoriques, utilisant la nature comme miroir de la vie humaine.",
        mots: [
          {
            kisakata: "Ebale eké mokémbá",
            francais: "La rivière n'oublie pas sa source",
            phonetique: "eh-BAH-leh eh-KEH moh-KEM-bah",
            emoji: "🌊",
          },
          {
            kisakata: "Zámba íbale míbalé",
            francais: "Deux forêts ne se ressemblent pas (chaque personne est unique)",
            phonetique: "ZAHM-bah EE-bah-leh MEE-bah-leh",
            emoji: "🌳",
          },
          {
            kisakata: "Nkókó akúfí, maloba maké",
            francais: "L'ancêtre est parti, mais ses paroles restent",
            phonetique: "n-KOH-koh ah-KOO-fee, mah-LOH-bah mah-KEH",
            emoji: "💭",
          },
          {
            kisakata: "Lobóko lókó loké kolála",
            francais: "Un seul bras ne suffit pas pour dormir (l'union fait la force)",
            phonetique: "loh-BOH-koh LOH-koh loh-KEH koh-LAH-lah",
            emoji: "🤝",
          },
          {
            kisakata: "Mái ma mbúla maké kosíla",
            francais: "L'eau de pluie ne finit jamais (la connaissance est infinie)",
            phonetique: "MAH-ee mah m-BOO-lah mah-KEH koh-SEE-lah",
            emoji: "💧",
          },
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
          "La musique Basakata est inséparable de la langue. Les chants rythment le travail aux champs, les cérémonies, les veillées funéraires. Le rythme est souvent donné par le tam-tam (Ngóma). La voix monte et descend comme la rivière — les tons du Kisakata deviennent mélodie.",
        mots: [
          { kisakata: "Loyémbo", francais: "Chant / Chanson", phonetique: "loh-YEM-boh", emoji: "🎵" },
          { kisakata: "Ngóma", francais: "Tam-tam / Tambour", phonetique: "n-GOH-mah", emoji: "🥁" },
          { kisakata: "Koyémba", francais: "Chanter", phonetique: "koh-YEM-bah", emoji: "🎤" },
          { kisakata: "Mabína", francais: "Danse", phonetique: "mah-BEE-nah", emoji: "💃" },
          { kisakata: "Bosémbo", francais: "Joie / Bonheur", phonetique: "boh-SEM-boh", emoji: "😊" },
          { kisakata: "Elingí", francais: "Amour", phonetique: "eh-leen-GEE", emoji: "❤️" },
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
