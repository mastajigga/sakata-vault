// src/data/articles.ts

export interface Article {
  slug: string;
  title: string;
  category: "langue" | "culture" | "spiritualite" | "histoire";
  summary: string;
  content: string;
  image?: string;
  videoBackground?: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "epopee-peuple-sakata",
    title: "L'épopée du peuple Sakata : Du Kongo au Mai-Ndombe",
    category: "histoire",
    summary: "Découvrez le voyage ancestral de nos pères, depuis les rives sacrées du Royaume du Kongo jusqu'aux forêts denses du Mai-Ndombe.",
    content: `
> *“Mai masɛli masɛli, kasi makoki kokata zamba te.”*
> — L’eau coule doucement, mais elle ne peut pas couper la forêt.
> — Proverbe de nos ancêtres qui nous rappelle que la patience et la souplesse de l’eau sont nos plus grandes forces.

Écoute, mon enfant, car ce que je vais te dire n’est pas écrit dans les livres des Blancs. C’est une parole qui a voyagé sur les pirogues, qui a dormi sous les feuilles de bananier et qui s'est transmise comme le feu d'un foyer à un autre. Notre histoire ne commence pas ici, dans la brume du lac Mai-Ndombe. Elle commence bien plus loin, là où le soleil se lève sur les collines de l'ancien *Kongo di Ntotila* (Royaume du Kongo).

### Le Départ de la Terre Mère

Il y a de cela des siècles, bien avant que les navires aux grandes voiles blanches n'apparaissent à l'horizon, une grande agitation s'emparait des clans de Mpemba Kasi. Nous étions une branche d'un grand arbre, une pousse vigoureuse qui cherchait son propre espace pour s'épanouir. On raconte que c'est une vision, un rêve partagé par nos *bakambi* (anciens), qui nous a poussés à regarder vers le nord-est.

Le voyage fut long, plus long que la mémoire d'un seul homme. Nous avons marché à travers les savanes, là où l'herbe est haute comme un guerrier, et nous avons pénétré dans la grande forêt qui ne finit jamais. À chaque étape, nous laissions une trace, un nom, une graine. Les Sakata ne fuyaient pas ; ils cherchaient la terre qui les reconnaîtrait.

### La Traversée de la Lukenie

Lorsque nous sommes arrivés au bord de la Lukenie, la rivière était en colère. Les eaux étaient sombres et les courants tiraient vers les profondeurs. C'est là que le miracle s'est produit. On dit que le grand esprit de la forêt, l' *eloko*, s'est manifesté sous la forme d'un banc de poissons d'argent pour nous montrer le gué. Nos ancêtres ont réalisé alors que cette terre n'était pas hostile, elle était une mère qui nous attendait.

Nous avons traversé, portant nos enfants sur nos épaules et nos semences dans des paniers de raphia. De l'autre côté, la forêt était plus dense, plus fraîche. Les arbres semblaient nous murmurer leurs noms. C'est ici, entre la Lukenie et la Fimi, que nous avons posé nos premiers *mboka* (villages).

### L'Alliance avec la Brume

Pourquoi avons-nous choisi cette région de lacs et de marécages ? Parce que la brume est le manteau des ancêtres. Elle nous protège des regards indiscrets et garde nos secrets au chaud. Dans le Mai-Ndombe, l'eau et la terre se marient chaque matin. Pour un Sakata, être chez soi, c'est sentir l'humidité de la forêt sur sa peau dès le réveil.

Nous sommes devenus les maîtres de la pirogue et les seigneurs de la récolte forestière. Nous avons appris à parler aux arbres et à lire les signes dans le vol des oiseaux. Notre structure sociale, matrilinéaire et respectueuse, s'est solidifiée comme les racines d'un vieux baobab. Nous venions du Grand Kongo, mais nous étions nés à nouveau dans la brume.

### Aujourd'hui et demain

Aujourd'hui, alors que nos enfants partent vers les grandes villes comme Kinshasa ou traversent les océans vers l'Europe, ils portent en eux cette trace de terre mouillée. Peu importe où tu te trouves, souviens-toi que tu es le fils de ceux qui ont traversé la Lukenie. Ton sang porte le rythme des rames sur l'eau et la patience de la forêt. Ne laisse pas la rivière de ta mémoire s'assécher.

[Écrit] Vansina, J., "Les anciens royaumes de la savane", IRES, 1965
[Oral] Mokambi Balinga, Village Semendua, 1982
[Terrain] Enquête ethnographique Sakata, Archive Kisakata, 2024
    `,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/iluo-into-the-eyes.mp4"
  },
  {
    slug: "rite-ngongo-sagesse",
    title: "Le Rite Ngongo : Le passage vers la sagesse",
    category: "culture",
    summary: "Décryptage du rite initiatique Ngongo, la porte d'entrée vers les mystères de l'existence et la responsabilité communautaire.",
    content: `
> *“Mokolo moko te, eloko moko te ; nzela moko te, ndako moko te.”*
> — Un seul jour ne fait pas une vie ; un seul chemin ne mène pas à la maison.
> — Sagesse du Ngongo sur la nécessité du temps et de l'apprentissage.

Approche-toi du feu, mon fils. Ne crains pas les ombres qui dansent sur les masques. Ce que tu vois là n'est pas de la peur, c'est du respect. Le **Ngongo** est le battement de cœur de notre culture. C'est le moment où le petit garçon qui court après les poules dans le village devient l'homme qui s'assoit avec les anciens pour décider du sort de la communauté.

### L'Appel de la Forêt Sacrée

Un matin, sans prévenir, les tambours changent de rythme. C'est le signal. Les jeunes garçons sont emmenés loin des regards des mères et des sœurs. On les conduit dans le *zamba ya bule* (bois sacré). Là, le village disparaît. Il n'y a plus de confort, plus de jeux faciles. Il n'y a que la forêt, les ancêtres et la vérité.

L'initiation dure des lunes entières. C'est une période de grand silence. On apprend aux initiés que la parole est une arme précieuse qu'il ne faut pas gaspiller. "Celui qui parle trop, dit le *mokambi* (sage), vide sa tête comme une gourde percée."

### Le Mystère de l'Iluo (Le Double)

Le secret le plus profond du Ngongo réside dans la découverte de l' *Iluo*. Nous croyons que chaque être humain n'est pas seul en ce monde. Il possède un double, un souffle invisible qui marche à ses côtés. Dans l'initiation, on apprend à accorder ses pas avec ceux de son double. Si l'homme est violent, l' *Iluo* s'éloigne et la protection disparaît. Si l'homme est sage, l' *Iluo* devient son bouclier.

C'est pour cela que nos masques ont souvent des traits doubles ou des regards tournés vers l'intérieur. Ils représentent cette dualité sacrée. Apprendre à vivre avec son double, c'est apprendre la responsabilité. Tu n'es jamais seul, donc tu n'es jamais libre de faire le mal.

### Les Maîtres des Plantes et des Signes

Dans la forêt, on n'apprend pas seulement à chasser ou à construire une case. On apprend le nom secret des *nkasa* (feuilles). Chaque plante est un remède ou un message. Le Ngongo enseigne comment soigner le corps, mais aussi comment apaiser les esprits de la rivière. On apprend à lire les traces dans la terre comme on lit un livre.

L'épreuve finale est celle du courage, mais pas du courage qui cherche la bagarre. Le courage de rester debout quand la faim tiraille l'estomac. Le courage de ne pas trahir le secret, même face à la menace. Un homme du Ngongo est un homme qui sait tenir sa langue et sa colonne vertébrale.

### La Sortie : Un Homme Nouveau

Quand les initiés reviennent au village, ils ne courent plus. Ils marchent avec une dignité nouvelle. On leur donne un nouveau nom, car l'enfant qu'ils étaient est mort dans la forêt. Ils sont maintenant les piliers du clan. Ils portent en eux les lois non écrites qui font que le peuple Sakata reste debout malgré les tempêtes du monde.

Ne regarde pas le Ngongo comme une chose du passé. C'est une graine qui doit germer dans ton cœur moderne. La discipline, le respect des aînés et la conscience du monde invisible sont les racines qui t'empêcheront de tomber quand le vent de la modernité soufflera trop fort.

[Écrit] Bylin, E., "La structure sociale des Sakata", MRAC Tervuren, 1966
[Terrain] Observation du rite Ngongo, Territoire de Kutu, 2023
[Oral] Mama Mboyo, Inongo, ~1975
    `,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/wan-iluo-into-the-eyes.mp4"
  },
  {
    slug: "lukeni-lua-nimi-fondateur",
    title: "Lukeni lua Nimi : L'ombre du fondateur",
    category: "histoire",
    summary: "Portrait du Manikongo originel dont l'aura influence encore aujourd'hui la structure sociale des peuples de la région.",
    content: `
> *“Nkundi ya bakoko : Nsusu moko te, okoki kopanza ndako.”*
> — Un seul ongle ne peut pas ouvrir un œuf.
> — Proverbe sur l'unité, fondement de l'empire de Lukeni.

Il y a des hommes dont le nom est comme un tonnerre qui ne s'éteint jamais. **Lukeni lua Nimi** est de ceux-là. On dit qu'il n'était pas seulement un guerrier, mais un architecte d'âmes. Bien que nous soyons aujourd'hui installés dans les forêts du Mai-Ndombe, l'ombre de ce grand roi plane encore sur nos structures sociales, comme l'ombre d'un grand aigle plane sur la savane.

### Le Forgeron de Mpemba

On raconte qu'au XIVe siècle, le jeune Nimi a Lukeni traversa le majestueux fleuve Congo avec un petit groupe de fidèles. Il n'apportait pas seulement des lances, il apportait la connaissance du fer. Il était un *moya-mukanda* (celui qui maîtrise le savoir). En forgeant le fer, il a forgé une nation. Il a su marier les clans entre eux, non par la force seule, mais par l'intelligence des alliances.

C'est lui qui a établi Mbanza Kongo sur la montagne protectrice. De cette cité rayonnante, les lois ont coulé comme des rivières vers toutes les directions. La hiérarchie, le respect de la lignée maternelle et le droit foncier que nous pratiquons encore chez les Sakata ont leurs racines dans cette terre sacrée.

### Le Lien Matrilinéaire : Le Sang de la Mère

L'un des plus grands héritages de Lukeni, que nous préservons jalousement, est le système matrilinéaire. Chez nous, le sang passe par la femme. Le chef n'est pas le fils du roi, il est le fils de sa sœur. Pourquoi ? Parce que la mère est la seule certitude de la vie. Lukeni comprenait que pour stabiliser un empire, il fallait s'appuyer sur ce qui est immuable.

Dans nos villages du Mai-Ndombe, le *nkasa* (pouvoir) est encore transmis selon cette logique. Ton oncle maternel est ton protecteur, ton père est ton guide. Cet équilibre subtil, qui évite les guerres de succession sanglantes, est un cadeau qui nous vient du fond des âges, de la cour de Mbanza Kongo.

### L'Écho dans la Diaspora

Aujourd'hui, quand un Sakata de Paris ou de Bruxelles cherche ses racines, il finit toujours par rencontrer l'ombre de Lukeni. C'est l'idée que nous appartenons à une civilisation vaste, complexe et ordonnée. Nous ne sommes pas des "tribus" errantes ; nous sommes les héritiers d'un système politique qui a duré des siècles.

Le nom de Lukeni lua Nimi ne doit pas rester dans la poussière de l'histoire. Il doit être une source de fierté. Il nous rappelle que l'Afrique a connu des temps de grandeur où la loi était respectée, où le commerce était florissant et où le savoir était l'honneur suprême. En apprenant son histoire, tu répares le pont brisé par la colonisation. Tu redeviens un citoyen de l'éternité Kongo.

[Écrit] Randles, W.G.L., "L'ancien royaume du Congo des origines à la fin du XIXe siècle", Mouton, 1968
[Archive] MRAC Tervuren, Fonds Torday, 1907
[Communauté] @BakokoEmpire, Discussion sur la lignée Sakata, 2025
    `,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/explore-with-the-double.mp4"
  },
  {
    slug: "origines-bantou-basakata",
    title: "Origines du peuple bantou et basakata",
    category: "histoire",
    summary: "Un voyage dans le temps vers le berceau de l'humanité bantoue et les migrations vers le cœur de l'Afrique.",
    content: `Contenu en cours de murmure...`,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/iluo-into-the-eyes.mp4"
  },
  {
    slug: "royaume-congo-racines",
    title: "Le Royaume du Congo : Nos Racines Oubliées",
    category: "histoire",
    summary: "Explorer les liens profonds entre l'empire de Ntotila et les peuples de la cuvette centrale.",
    content: `Contenu en cours de murmure...`,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/wan-iluo-into-the-eyes.mp4"
  },
  {
    slug: "iluo-les-doubles",
    title: "Iluo : Le Mystère des Doubles",
    category: "spiritualite",
    summary: "Plongez dans la métaphysique Sakata et la relation entre l'homme et son double invisible.",
    content: `Contenu en cours de murmure...`,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/explore-with-the-double.mp4"
  },
  {
    slug: "corps-esprit-souffle",
    title: "Corps, Esprit et Souffle : La Trinité Sakata",
    category: "spiritualite",
    summary: "Comprendre la constitution de l'être humain selon la sagesse ancestrale.",
    content: `Contenu en cours de murmure...`,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/iluo-into-the-eyes.mp4"
  },
  {
    slug: "energie-vitale-moyo",
    title: "Moyo : Le Flux de l'Énergie Vitale",
    category: "spiritualite",
    summary: "Comment l'énergie circule dans la nature, les plantes et les hommes.",
    content: `Contenu en cours de murmure...`,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/wan-iluo-into-the-eyes.mp4"
  },
  {
    slug: "culture-generale-mboka",
    title: "Mboka : Vivre Ensemble chez les Sakata",
    category: "culture",
    summary: "Les fondements de la vie communautaire, de la solidarité et du partage au village.",
    content: `Contenu en cours de murmure...`,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/explore-with-the-double.mp4"
  },
  {
    slug: "langue-kisakata-introduction",
    title: "La Langue Kisakata : Introduction",
    category: "langue",
    summary: "Pourquoi préserver notre langue maternelle est un acte de résistance culturelle.",
    content: `Contenu en cours de murmure...`,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/iluo-into-the-eyes.mp4"
  },
  {
    slug: "proverbes-nkundi-sagesse",
    title: "Nkundi : La Force des Proverbes",
    category: "langue",
    summary: "Une collection commentée des plus beaux proverbes de nos pères.",
    content: `Contenu en cours de murmure...`,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/wan-iluo-into-the-eyes.mp4"
  },
  {
    slug: "artisanat-masques-sculptures",
    title: "Artisanat : Masques et Sculptures du Mai-Ndombe",
    category: "culture",
    summary: "L'art de donner forme au monde invisible à travers le bois et le raphia.",
    content: `Contenu en cours de murmure...`,
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/explore-with-the-double.mp4"
  }
];
