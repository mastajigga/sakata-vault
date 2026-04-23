<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

- **Next.js:** This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in node_modules/next/dist/docs/ before writing any code. Heed deprecation notices.
- **Supabase Scheme:** La table profiles utilise username et nickname. Ne jamais utiliser display_name (colonne inexistante).
- **Netlify:** Pour le forum public, préférer supabasePublic (src/lib/supabase.ts) au lieu de supabaseAdmin pour éviter les timeouts liés à l'absence de clé de service dans le bundle client/serveur public.
- **Contenu Structure (V3):** Les articles supportent désormais un format par blocs (`ContentBlock[]`). Dans l'éditeur admin, préférez le mode blocs pour les mises en page complexes (images latérales). Toujours maintenir `blocksToString` et `stringToBlocks` synchronisés avec `src/types/i18n.ts`.
- **AI Orchestration (Netlify Build):** Ne JAMAIS instancier les clients Pinecone ou GoogleGenerativeAI à la racine d'un fichier API Route. Toujours les instancier À L'INTÉRIEUR du handler (POST/GET) pour éviter les erreurs de variables d'environnement manquantes lors du build Netlify. Utiliser `export const dynamic = 'force-dynamic'`.
<!-- END:nextjs-agent-rules -->
