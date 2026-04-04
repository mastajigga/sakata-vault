// src/data/articles.ts
import { ArticleData } from "@/types/i18n";

export const ARTICLES: ArticleData[] = [
  {
    slug: "epopee-peuple-sakata",
    title: {
      fr: "L'épopée du peuple Sakata : Du Kongo au Mai-Ndombe",
      skt: "Nsoni ya Basakata: Mboka ya Kongo tii Mai-Ndombe",
      lin: "Lisolo ya bato ya Sakata: Longwa na Kongo tii na Mai-Ndombe",
    },
    category: "histoire",
    summary: {
      fr: "Découvrez le voyage ancestral de nos pères, depuis les rives sacrées du Royaume du Kongo jusqu'aux forêts denses du Mai-Ndombe.",
      skt: "Yeba mobembo ya bakoko na biso...",
      lin: "Yeba mobembo ya bankoko na biso na mabele ya Kongo...",
    },
    content: {
      fr: `
> *“Mai masɛli masɛli, kasi makoki kokata zamba te.”*
> — L’eau coule doucement, mais elle ne peut pas couper la forêt.
> — Proverbe de nos ancêtres qui nous rappelle que la patience et la souplesse de l’eau sont nos plus grandes forces.

Écoute, mon enfant, car ce que je vais te dire n’est pas écrit dans les livres des Blancs. C’est une parole qui a voyagé sur les pirogues, qui a dormi sous les feuilles de bananier et qui s'est transmise comme le feu d'un foyer à un autre. Notre histoire ne commence pas ici, dans la brume du lac Mai-Ndombe. Elle commence bien plus loin, là où le soleil se lève sur les collines de l'ancien *Kongo di Ntotila* (Royaume du Kongo).

### Le Départ de la Terre Mère

Il y a de cela des siècles, bien avant que les navires aux grandes voiles blanches n'apparaissent à l'horizon, une grande agitation s'emparait des clans de Mpemba Kasi. Nous étions une branche d'un grand arbre, une pousse vigoureuse qui cherchait son propre espace pour s'épanouir. On raconte que c'est une vision, un rêve partagé par nos *bakambi* (anciens), qui nous a poussés à regarder vers le nord-est.

Le voyage fut long, plus long que la mémoire d'un seul homme. Nous avons marché à travers les savanes, là où l'herbe est haute comme un guerrier, et nous avons pénétré dans la grande forêt qui ne finit jamais. À chaque étape, nous laissions une trace, un nom, une graine. Les Sakata ne fuyaient pas ; ils cherchaient la terre qui les reconnaîtrait.

### La Traversée de la Lukenie

Lorsque nous sommes arrivés au bord de la Lukenie, la rivière était en colère. Les eaux étaient sombres et les courants tiraient vers les profondeurs. C'est là que le miracle s'est produit. On dit que le grand esprit de la forêt, l' *eloko*, s'est manifesté sous la forme d'un banc de poissons d'argent pour nous montrer le gué. Nos ancêtres ont réalisé alors que cette terre n'était pas hostile, elle était une mère qui nous attendait.

### L'Alliance avec la Brume

Pourquoi avons-nous choisi cette région de lacs et de marécages ? Parce que la brume est le manteau des ancêtres. Elle nous protège des regards indiscrets et garde nos secrets au chaud. Dans le Mai-Ndombe, l'eau et la terre se marient chaque matin. Pour un Sakata, être chez soi, c'est sentir l'humidité de la forêt sur sa peau dès le réveil.

[Écrit] Vansina, J., "Les anciens royaumes de la savane", IRES, 1965
[Oral] Mokambi Balinga, Village Semendua, 1982
[Terrain] Enquête ethnographique Sakata, Archive Kisakata, 2024
`,
      lin: `Lisolo ya bankoko na biso ebandaki kala na mabele ya Kongo...`,
    },
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/iluo-into-the-eyes.mp4"
  },
  {
    slug: "rite-ngongo-sagesse",
    title: {
      fr: "Le Rite Ngongo : Le passage vers la sagesse",
      skt: "Ngongo: Nsoni ya bwanya",
      lin: "Ngongo: Molulu ya mayele",
    },
    category: "culture",
    summary: {
      fr: "Décryptage du rite initiatique Ngongo, la porte d'entrée vers les mystères de l'existence.",
      lin: "Koyeba molulu ya Ngongo mpo na kokola na mayele.",
    },
    content: {
      fr: `
> *“Mokolo moko te, eloko moko te ; nzela moko te, ndako moko te.”*
> — Un seul jour ne fait pas une vie ; un seul chemin ne mène pas à la maison.

Approche-toi du feu, mon fils. Ne crains pas les ombres qui dansent sur les masques...
`,
    },
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/wan-iluo-into-the-eyes.mp4"
  },
  {
    slug: "lukeni-lua-nimi-fondateur",
    title: {
      fr: "Lukeni lua Nimi : L'ombre du fondateur",
      lin: "Lukeni lua Nimi: Molimo ya mobandisi",
    },
    category: "histoire",
    summary: {
      fr: "Portrait du Manikongo originel dont l'aura influence encore aujourd'hui la structure sociale.",
      lin: "Lisolo ya Manikongo ya liboso mpe ndenge asalisaki biso.",
    },
    content: {
      fr: `
> *“Nkundi ya bakoko : Nsusu moko te, okoki kopanza ndako.”*
> — Un seul ongle ne peut pas ouvrir un œuf.

Il y a des hommes dont le nom est comme un tonnerre qui ne s'éteint jamais. Lukeni lua Nimi est de ceux-là...
`,
    },
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/explore-with-the-double.mp4"
  },
  // Stubs for the remaining 9 articles
  ...[
    "origines-bantou-basakata",
    "royaume-congo-racines",
    "iluo-les-doubles",
    "corps-esprit-souffle",
    "energie-vitale-moyo",
    "culture-generale-mboka",
    "langue-kisakata-introduction",
    "proverbes-nkundi-sagesse",
    "artisanat-masques-sculptures"
  ].map(slug => ({
    slug,
    title: { fr: slug.replace(/-/g, " ") },
    category: "culture" as const,
    summary: { fr: "Contenu en cours de murmure..." },
    content: { fr: "Contenu en cours de murmure..." },
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/iluo-into-the-eyes.mp4"
  }))
];
