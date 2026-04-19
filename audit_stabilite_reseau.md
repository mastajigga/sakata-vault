# 🛡️ Audit de Stabilité Réseau & Résolution des Sockets

Ce document détaille l'investigation sur les blocages du site Sakata Digital Hub et les solutions implémentées pour garantir une navigation fluide sans "hard reload".

## 1. Diagnostic de la "Root Cause"

L'audit a révélé que le problème n'était pas une erreur de code unique, mais un phénomène de **Saturation de Socket Cascading**.

### Les Facteurs Clés :
1.  **Limite des 6 Sockets (Chrome/Edge/Safari)** : Les navigateurs limitent à 6 le nombre de connexions TCP simultanées vers un même domaine (supabase.co).
2.  **Saturation au Démarrage (Boot Storm)** :
    *   `AuthProvider` : Interroge `profiles` pour le rôle.
    *   `ChatUnreadContext` : Lance un RPC `get_user_conversations_v4`.
    *   `Home` : Télécharge tous les `articles`.
    *   `checkConnection` : Lance un ping sur `profiles`.
3.  **Hanging Requests** : Si une requête (ex: Auth) met du temps à répondre ou si le token JWT est en rotation, elle occupe une socket. Si 6 requêtes sont "en attente", le navigateur bloque **toutes** les nouvelles requêtes (y compris les clics utilisateur).
4.  **Race Conditions Next.js** : Lors des changements de page rapides, certains composants restaient montés ou se remontaient avant que l'ancien fetch ne soit annulé, accumulant les requêtes fantômes dans le pool du navigateur.

---

## 2. Solutions Implémentées (Intelligent Traffic Control)

Au lieu de simplement ajouter des logs, nous avons pris le contrôle de l'ordonnanceur réseau du navigateur.

### A. Le Proxy de Traffic Control (`src/lib/supabase.ts`)
Nous avons transformé le client Supabase en un véritable "Contrôleur de Trafic" :
*   **Concurrency Limiter** : Le proxy limite désormais les requêtes Postgrest à **4 simultanées**.
*   **Headroom Garanti** : En limitant à 4, nous laissons **toujours 2 sockets libres** pour les appels critiques (`auth.getSession`, `auth.refreshSession`) et les assets (images).
*   **Priority Queuing** : Les requêtes sur la table `profiles` (critiques pour l'initialisation de l'UI) sont prioritaires dans la file d'attente.
*   **Polyfill AbortSignal** : Sécurité contre les crashs TypeScript sur les méthodes de builder.

### B. Séquençage de l'Authentification (`src/components/AuthProvider.tsx`)
*   **Délai de Courtoisie** : Le test de connexion (`checkConnection`) est décalé de 1.5s pour laisser le processus `init` (Session) se terminer sans compétition.
*   **Timeout Accru** : `getSession` dispose maintenant de 10s pour répondre avant de déclencher un mode de secours, évitant les blocages infinis sur connexions lentes.

### C. Conditionnement du Montage (`src/app/page.tsx`)
*   **Wait for Auth** : Les articles du Home ne sont plus téléchargés tant que l'Auth n'est pas stable (`authLoading === false`). Cela libère la bande passante pour la connexion initiale.

---

## 3. Plan d'Action & Robustesse

### Mesures Immédiates :
- [x] Proxy avec limiteur de concurrence (Max 4).
- [x] Priorisation des requêtes de profil.
- [x] Séquençage Auth vs Data.
- [x] Polyfill `abortSignal`.

### Comment tester :
1. Ouvrez la console.
2. Naviguez rapidement entre les pages.
3. Observez les logs `[NET-QUEUE-WAIT]` et `[NET-START]`. 
4. Si trop de requêtes arrivent, vous verrez le système les mettre en attente et les libérer progressivement, empêchant le navigateur de "freeze" ses sockets.

## 4. Conclusion
Le système est désormais **auto-régulateur**. Même en cas de réseau lent ou d'usage intensif, le site ne pourra plus saturer le pool de sockets du navigateur. Le "hard reload" ne devrait plus être nécessaire car les sockets ne resteront plus orphelines.
