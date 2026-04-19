# Changelog — Sakata Digital Hub

Toutes les modifications notables apportées au projet seront documentées dans ce fichier.

## [2.6.0] - 2026-04-19
### Ajouté
- Export `supabasePublic` dans `src/lib/supabase.ts` pour une meilleure gestion du SSR sur Netlify.
- Rapport de stabilisation détaillé dans `docs/STABILIZATION_v2.5.md`.

### Corrigé
- **Boucle de rendu infinie** dans `AuthProvider` résolue via un verrou `initStarted` (ref).
- **Saturation réseau** : Suppression des logs proxy trop verbeux qui bloquaient le thread principal.
- **Erreurs 404** : Correction des chemins d'images pour les articles "Ngongo" (Local + Supabase DB).
- **SSR /savoir** : Correction de l'import Supabase pour éviter les timeouts en production.
- **Compatibilité Assets** : Meilleure gestion des propriétés hybrides `image` / `featured_image`.

## [2.5.0] - 2026-04-19
### Ajouté
- **Traffic Control Proxy** : Limiteur de concurrence (Max 4) pour éviter la saturation des sockets.
- Séquençage de l'authentification vs chargement des données.
- Audit de robustesse initial (`audit_stabilite_reseau.md`).

## [2.4.0] - 2026-04-17
### Ajouté
- Migration complète vers **Next.js Image** pour optimiser le LCP.
- Système de cache hybride (SWR + localStorage).
- Rebranding **Kisakata → Sakata**.

---
*Ancêtres, guidez nos pas dans le code.*
