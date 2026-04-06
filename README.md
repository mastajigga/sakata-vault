# Kisakata Digital Hub

Kisakata est bien plus qu'un site ; c'est un sanctuaire numérique immersif destiné à préserver, promouvoir et transmettre l'héritage culturel, historique et linguistique du peuple Sakata.

Le projet a évolué depuis de simples pages de présentation vers une plateforme dynamique complète avec **Mur payant (Premium)**, un **Forum en temps-réel (Mboka)**, et un **Espace d'Administration sécurisé**.

---

## 🛠 Technologies
- **Front-end:** Next.js 16 (App Router), React 18, Turbopack
- **Styles & Animations:** Tailwind CSS, GSAP, Framer Motion
- **Back-end & Base de Données:** Supabase (Auth, RLS, Storage, Realtime)
- **Typographie:** Next Font (Outfit, Geist Mono)

---

## 🚀 Fonctionnalités Principales

1. **Expérience Narrative V1 ("Brume de la Rivière"):**
   Un design très spécifique reposant sur des contrastes saisissants entre les tons de la forêt (vert foncé `#0A1F15`) et l'or ancestral (`#B59551`). 

2. **Système de Savoirs (Base d'articles Dynamique):**
   Un système de blog/encyclopédie stocké dans Supabase, requêtant les images séquentiellement. **Paywall intégré**: les utilisateurs gratuits n'ont accès qu'à une portion des articles premium.

3. **Le Forum "Mboka" (Le Village):**
   Un espace de discussion où les gardiens de la culture se retrouvent.
   - Système de "Catégories" dynamiques.
   - Gestion de threads (Sujets) avec **éditeur Markdown enrichi**.
   - Flux de réponses **en Temps Réel** piloté par Supabase Channels.

4. **Command Center Administrateur:**
   Tableau de bord exclusif avec **Intelligence Géographique (IP)**, graphiques de trafic, gestion des membres, changement des statuts et gestion des articles.

5. **Internationalisation (i18n):**
   Interface traduisible en 5 langues (Français, Kisakata, Lingala, Swahili, Tshiluba) gérée par un Context Global.

---

## ⚙️ Installation & Lancement

1. Cloner le répertoire et installez les dépendances :
   ```bash
   npm install
   ```
2. Renseignez le fichier d'environnement `.env.local` en y intégrant vos identifiants Supabase :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. Lancer le serveur local (Turbopack) :
   ```bash
   npm run dev
   ```

*Ce projet respecte des cadres précis documentés à destination de l'IA situés dans `CLAUDE.md`, et s'appuie sur de nombreuses intégrations "skills". Le respect strict de cet écosystème est obligatoire.*
