<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

- **Next.js:** This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in node_modules/next/dist/docs/ before writing any code. Heed deprecation notices.
- **Supabase Scheme:** La table profiles utilise username et nickname. Ne jamais utiliser display_name (colonne inexistante).
- **Netlify:** Pour le forum public, préférer supabasePublic (src/lib/supabase.ts) au lieu de supabaseAdmin pour éviter les timeouts liés à l'absence de clé de service dans le bundle client/serveur public.
<!-- END:nextjs-agent-rules -->
