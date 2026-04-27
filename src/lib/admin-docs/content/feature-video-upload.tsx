import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-video-upload",
  title: "Upload Vidéo Hero d'Article",
  subtitle:
    "Téléversement direct de vidéos lourdes (jusqu'à 50 MB) pour la section héro d'un article — depuis le navigateur jusqu'à Supabase Storage, sans passer par les serveurs Netlify.",
  category: "feature",
  order: 1,
  readTime: 8,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["supabase-storage", "rls", "netlify-limits", "upload"],
  summary:
    "Comment et pourquoi nous avons abandonné l'API route Next.js au profit d'un upload direct navigateur → Supabase Storage, avec RLS adaptées.",
};

export const Content = () => (
  <>
    <DocLead>
      Cette fonctionnalité permet aux administrateurs et managers de définir une vidéo
      d'arrière-plan immersive en tête d'un article (effet « hero »). Derrière une UI
      simple — drag-and-drop, preview, suppression — se cache un parcours technique
      contraint par les limites d'infrastructure de Netlify.
    </DocLead>

    <DocSection title="Qu'est-ce que c'est ?" eyebrow="Définition">
      <DocP>
        Le bloc « Vidéo Héro » est un champ optionnel sur chaque article publié dans la
        rubrique <DocInline>savoir/</DocInline>. Lorsqu'il est renseigné, la vidéo
        s'affiche en pleine largeur en haut de la page article, jouée en boucle silencieuse
        (autoplay muted loop), créant un effet cinématique propre à l'esthétique
        « Brume de la Rivière ».
      </DocP>
      <DocP>
        Le champ accepte les formats <DocInline>video/mp4</DocInline>,{" "}
        <DocInline>video/webm</DocInline> et <DocInline>video/quicktime</DocInline>{" "}
        jusqu'à 50 MB. La vidéo est stockée dans le bucket Supabase{" "}
        <DocInline>article-videos</DocInline> et son URL publique est persistée dans la
        colonne <DocInline>articles.hero_video_url</DocInline>.
      </DocP>
    </DocSection>

    <DocSection title="Pourquoi cette implémentation, et pas une autre ?" eyebrow="Décision">
      <DocCallout type="decision" title="Choix retenu">
        Upload direct du navigateur vers Supabase Storage, sans intermédiaire
        serveur. L'API route Next.js initialement utilisée a été abandonnée.
      </DocCallout>

      <DocSubsection title="Première approche (échec) : API route Next.js">
        <DocP>
          La première version envoyait le fichier en <DocInline>FormData</DocInline> vers{" "}
          <DocInline>/api/admin/articles/upload-hero-video</DocInline>, qui validait le
          JWT, vérifiait le rôle, puis téléversait via le client admin Supabase
          (<DocInline>service_role</DocInline>).
        </DocP>
        <DocCallout type="error" title="Pourquoi ça échouait">
          <DocP>
            Netlify Functions imposent une limite de payload d'environ 6 MB. Toute vidéo
            au-delà de cette taille fait crasher la fonction <strong>avant même</strong>{" "}
            qu'elle ne s'exécute. La réponse renvoyée est un texte brut «{" "}
            <DocInline>Internal Error. ID: 01KQ...</DocInline> », ce qui faisait
            secondairement crasher <DocInline>JSON.parse()</DocInline> côté client.
          </DocP>
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="Approche retenue : upload direct navigateur → Storage">
        <DocP>
          Le navigateur utilise le SDK <DocInline>@supabase/ssr</DocInline> pour appeler
          directement <DocInline>supabase.storage.from(...).upload(...)</DocInline>. Le
          JWT de session est attaché automatiquement par le client. Aucune fonction
          serveur n'est dans le chemin du fichier.
        </DocP>
        <DocCode lang="typescript" caption="Cœur de l'upload côté client">{`const { data, error } = await supabase.storage
  .from("article-videos")
  .upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

if (error) { /* afficher toast */ }

const { data: urlData } = supabase.storage
  .from("article-videos")
  .getPublicUrl(data.path);

setArticle({ ...article, hero_video_url: urlData.publicUrl });`}</DocCode>

        <DocSubsection title="Pourquoi ce choix vs. les alternatives">
          <DocTable
            headers={["Option", "Pour", "Contre", "Verdict"]}
            rows={[
              [
                "API route Next.js",
                "Auth centralisée, validation côté serveur",
                "Plafond 6 MB Netlify, latence supplémentaire",
                "❌ Inutilisable",
              ],
              [
                "Signed URL (S3 presigned-style)",
                "Pas de proxy, granularité fine",
                "Plus de complexité (générer URL avant upload), pas natif Supabase",
                "🟡 Possible mais surdimensionné",
              ],
              [
                "Upload direct + RLS",
                "Simple, natif Supabase, pas de serveur",
                "Sécurité dépend de RLS bien écrites",
                "✅ Retenu",
              ],
              [
                "Service tiers (Cloudinary, Mux)",
                "Optimisation vidéo automatique, CDN",
                "Coût mensuel, dépendance externe, vendor lock-in",
                "🟡 Trop tôt, à reconsidérer pour la Veillée Numérique",
              ],
            ]}
          />
        </DocSubsection>
      </DocSubsection>
    </DocSection>

    <DocSection title="Architecture technique" eyebrow="Comment">
      <DocSubsection title="Schéma de base de données">
        <DocCode lang="sql" caption="Migration appliquée">{`-- 20260426_article_hero_video.sql
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS hero_video_url TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_hero_video_url
  ON public.articles(hero_video_url);`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Politiques RLS du bucket">
        <DocP>
          Le bucket <DocInline>article-videos</DocInline> est public en lecture (les
          vidéos doivent pouvoir être servies à tout visiteur d'un article), mais
          écriture restreinte aux profils <DocInline>admin</DocInline> et{" "}
          <DocInline>manager</DocInline>.
        </DocP>
        <DocCode lang="sql" caption="20260427_article_videos_storage_policies.sql">{`CREATE POLICY "article_videos_admin_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'article-videos'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
  )
);
-- + équivalents pour UPDATE, DELETE
-- + SELECT policy publique`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Flux complet">
        <DocList
          ordered
          items={[
            <>L'admin sélectionne ou drag-and-drop une vidéo dans le composant <DocInline>HeroVideoCard</DocInline>.</>,
            <>Validation client : MIME type ∈ {`{mp4, webm, quicktime}`}, taille ≤ 50 MB.</>,
            <>Génération d'un nom de fichier sanitisé : <DocInline>articles/&lt;id&gt;/&lt;timestamp&gt;-&lt;cleanName&gt;.&lt;ext&gt;</DocInline>.</>,
            <>Upload via <DocInline>supabase.storage.upload()</DocInline> — le SDK ajoute le JWT.</>,
            <>RLS Postgres vérifie que <DocInline>auth.uid()</DocInline> a le rôle requis.</>,
            <>Récupération de l'URL publique via <DocInline>getPublicUrl()</DocInline>.</>,
            <>Mise à jour locale du state React : <DocInline>article.hero_video_url</DocInline>.</>,
            <>L'admin clique sur « Publier » → la valeur est persistée en DB via <DocInline>upsert</DocInline>.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Indicateur de progression">
        <DocP>
          Le SDK Supabase n'expose pas d'événements de progression natifs sur{" "}
          <DocInline>upload()</DocInline>. Une progression simulée est utilisée (fillrate
          dépendant de la taille du fichier), forcée à 100% à la résolution de la promesse.
          Pour une progression réelle, il faudrait passer aux uploads tus.io résumables —
          c'est <strong>déjà supporté</strong> par Supabase Storage v2 mais ajoute de la
          complexité non nécessaire à ce stade.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Difficultés rencontrées" eyebrow="Retour d'expérience">
      <DocSubsection title="1. JWT validation cassée (intercepté tôt)">
        <DocP>
          Le code initial appelait <DocInline>supabaseAdmin.auth.admin.getUserById("")</DocInline>{" "}
          avec une chaîne vide — le JWT du client n'était jamais réellement validé. Cette
          erreur a été corrigée en utilisant <DocInline>jwtVerify</DocInline> de la
          librairie <DocInline>jose</DocInline> avec <DocInline>SUPABASE_JWT_SECRET</DocInline>.
        </DocP>
      </DocSubsection>

      <DocSubsection title="2. Le package `jose` n'était pas installé">
        <DocP>
          La validation JWT importait <DocInline>jose</DocInline> mais le package n'était
          pas dans <DocInline>package.json</DocInline>. Le build TypeScript local passait
          (cache de types stale) mais Netlify aurait crashé. Détecté avant déploiement
          grâce à <DocInline>tsc --noEmit</DocInline>.
        </DocP>
      </DocSubsection>

      <DocSubsection title="3. Limite de payload Netlify (le vrai blocant)">
        <DocP>
          Symptôme : <strong>500 Internal Server Error</strong> avec un body texte brut.
          Cause racine : la fonction n'arrivait jamais à s'exécuter — Netlify rejette le
          body avant. La solution n'était pas dans le code de la fonction mais dans
          l'architecture : sortir le fichier du chemin de la fonction.
        </DocP>
        <DocCallout type="warning" title="Leçon retenue">
          <DocP>
            Pour tout fichier {`>`} 4 MB sur Netlify, ne pas le faire transiter par une
            Function. Soit upload direct vers le storage tiers, soit utiliser des signed
            URLs. Ce principe vaudra pour la future fonctionnalité <strong>Veillée
            Numérique</strong> (audio long).
          </DocP>
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="4. JSON.parse sur réponse vide">
        <DocP>
          Quand Netlify renvoyait son texte d'erreur, le code client tentait{" "}
          <DocInline>response.json()</DocInline> qui crashait. Le wrapper a été remplacé
          par <DocInline>response.text()</DocInline> + parsing tolérant — même si on est
          maintenant en upload direct, ce pattern défensif est conservé pour les autres
          API routes.
        </DocP>
      </DocSubsection>

      <DocSubsection title="5. RLS manquantes (par défaut, accès refusé)">
        <DocP>
          Supabase Storage applique RLS sur la table <DocInline>storage.objects</DocInline>.
          Sans politiques explicites, <strong>aucun upload n'est autorisé</strong>, même
          avec un JWT valide. Quatre politiques ont été ajoutées :
          INSERT/UPDATE/DELETE pour admin/manager, SELECT public.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Limitations connues" eyebrow="À savoir">
      <DocList
        items={[
          <>Pas de progression réelle pendant l'upload (simulée).</>,
          <>Pas de transcodage : la vidéo est servie telle quelle. Un .mov de 45 MB peut être lent à charger sur 3G.</>,
          <>Pas de génération de thumbnail automatique (le poster est l'image principale de l'article).</>,
          <>Pas de cleanup automatique des anciennes vidéos quand on les remplace — accumulation possible dans le bucket.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Évolutions prévues" eyebrow="Roadmap">
      <DocList
        items={[
          <>Job nightly de garbage-collection des vidéos orphelines (non référencées par aucun article).</>,
          <>Transcodage automatique vers WebM/AV1 via un service tiers (Mux ou Cloudflare Stream) si le coût se justifie.</>,
          <>Génération automatique de thumbnail à la 1ʳᵉ seconde via FFmpeg edge function.</>,
          <>Upload résumable (tus.io) pour résilience aux coupures réseau.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Fichiers concernés" eyebrow="Référence">
      <DocList
        items={[
          <><DocInline>src/app/admin/content/[slug]/page.tsx</DocInline> — Composant éditeur, fonction <DocInline>handleVideoUpload()</DocInline></>,
          <><DocInline>src/lib/admin-docs/DocLayout.tsx</DocInline> — Couche de présentation</>,
          <><DocInline>migrations/20260426_article_hero_video.sql</DocInline> — Schéma colonne</>,
          <><DocInline>migrations/20260427_article_videos_storage_policies.sql</DocInline> — Politiques RLS</>,
          <><DocInline>scripts/setup-storage-buckets.ts</DocInline> — Création initiale du bucket</>,
        ]}
      />
    </DocSection>
  </>
);
