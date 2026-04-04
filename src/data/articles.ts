// src/data/articles.ts
import { ArticleData } from "@/types/i18n";

export const ARTICLES: ArticleData[] = [
  {
    slug: "epopee-peuple-sakata",
    title: {
      fr: "L'épopée du peuple Sakata : Du Kongo au Mai-Ndombe",
      skt: "Nsoni ya Basakata: Mboka ya Kongo tii Mai-Ndombe",
      lin: "Lisolo ya bato ya Sakata: Longwa na Kongo tii na Mai-Ndombe",
      swa: "Heroi ya watu wa Sakata: Kutoka Kongo hadi Mai-Ndombe",
      tsh: "Kalasa ka bena Sakata: Mbula wa Kongo too ne Mai-Ndombe",
    },
    category: "histoire",
    summary: {
      fr: "Découvrez le voyage ancestral de nos pères, depuis les rives sacrées du Royaume du Kongo jusqu'aux forêts denses du Mai-Ndombe.",
      skt: "Yeba mobembo ya bakoko na biso kifuma na Kongo tii Mai-Ndombe.",
      lin: "Yeba mobembo ya bankoko na biso na mabele ya Kongo tii na zamba ya Mai-Ndombe.",
      swa: "Gundua safari ya asili ya baba zetu, kutoka fukwe takatifu za Ufalme wa Kongo hadi misitu minene ya Mai-Ndombe.",
      tsh: "Kumanya lwendu lwa kale lwa batatu betu, kufuma mu mayi a mfula a Bukalenga bua Kongo too ne mu bitupa bia Mai-Ndombe.",
    },
    content: {
      fr: `
> *“Mai masɛli masɛli, kasi makoki kokata zamba te.”*
> — L’eau coule doucement, mais elle ne peut pas couper la forêt.
> — Proverbe de nos ancêtres qui nous rappelle que la patience et la souplesse de l’eau sont nos plus grandes forces.

Écoute, mon enfant... Notre histoire commence bien plus loin, là où le soleil se lève sur les collines de l'ancien *Kongo di Ntotila* (Royaume du Kongo).`,
      lin: `Yoka, mwana na ngai... Lisolo na biso ebandaki kala na mabele ya Kongo di Ntotila.`,
      skt: `Woka, mwana na me... Nsoni na biso eyambilaki kala na nse ya Kongo di Ntotila.`,
      swa: `Sikiliza, mwanangu... Historia yetu ilianza muda mrefu uliopita katika ardhi ya Kongo di Ntotila.`,
      tsh: `Teleka, muana wanyi... Malu etu akabangila kale mu buloba bua Kongo di Ntotila.`,
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
      swa: "Desturi ya Ngongo: Lango la hekima",
      tsh: "Tshivuifu tshia Ngongo: Kakumbishilu ka meji",
    },
    category: "culture",
    summary: {
      fr: "Décryptage du rite initiatique Ngongo, la porte d'entrée vers les mystères de l'existence.",
      skt: "Yeba molulu ya Ngongo mpo na bwanya.",
      lin: "Koyeba molulu ya Ngongo mpo na kokola na mayele ya bomoi.",
      swa: "Tafsiri ya desturi ya Ngongo, lango la kwanza kuelekea siri za maisha.",
      tsh: "Kumanya tshivuifu tshia Ngongo, mbelu wa kwanza wa kumpanyina malu a muoyo.",
    },
    content: {
      fr: `Approche-toi du feu, mon fils. Le rite Ngongo est le souffle de la terre.`,
      lin: `Pusana pene na moto, mwana na ngai. Molulu ya Ngongo ezali mpema ya mabele.`,
      skt: `Pusana pene na tiya, mwana na me. Ngongo iye mpema ya nse.`,
      swa: `Karibia moto, mwanangu. Desturi ya Ngongo ni pumzi ya ardhi.`,
      tsh: `Sema pabuipi ne katuya, muana wanyi. Tshivuifu tshia Ngongo nediaka dia buloba.`,
    },
    image: "/images/sakata_mask_detail.png",
    videoBackground: "/videos/wan-iluo-into-the-eyes.mp4"
  },
  {
    slug: "lukeni-lua-nimi-fondateur",
    title: {
      fr: "Lukeni lua Nimi : L'ombre du fondateur",
      skt: "Lukeni lua Nimi: Kiyila ya mobandisi",
      lin: "Lukeni lua Nimi: Molimo ya mobandisi",
      swa: "Lukeni lua Nimi: Kivuli cha mwanzilishi",
      tsh: "Lukeni lua Nimi: Dilembi dia muandishi",
    },
    category: "histoire",
    summary: {
      fr: "Portrait du Manikongo originel dont l'aura influence encore aujourd'hui la structure sociale.",
      skt: "Nsoni ya Manikongo ya yambula...",
      lin: "Lisolo ya Manikongo ya liboso mpe ndenge asalisaki biso.",
      swa: "Picha ya Manikongo wa kwanza ambaye aura yake bado inathiri muundo wa jamii leo.",
      tsh: "Tshimfuanyi tshia Manikongo wa kwanza kudi aura yendé itshidi ishintsha bulongolodi bua bantu lelu.",
    },
    content: {
      fr: `Il y a des hommes dont le nom est comme un tonnerre qui ne s'éteint jamais.`,
      lin: `Ezali na bato oyo nkombo na bango ezali lokola mikalali oyo ekufaka te.`,
      skt: `Iye na bato ba nkombo na bo iye bo nkele iye ekufaka te.`,
      swa: `Kuna watu ambao majina yao ni kama radi ambayo haizimiki kamwe.`,
      tsh: `Kudi bantu badia mbila yabu idi bu tshimfufu tshidi tshiapu tshiakufua.`,
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
