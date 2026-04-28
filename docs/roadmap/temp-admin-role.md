# Rôle « Administrateur Temporaire » (temp_admin)

> **Statut :** ✅ Décisions prises · prêt à exécuter
> **Date :** 2026-04-28
> **Auteur :** Direction Sakata

---

## 🎯 Vision

Permettre à un admin titulaire de **déléguer ses pouvoirs pour 24 heures** à un user
de confiance (ex : durant un voyage, une absence, une formation interne) sans
risquer une compromission permanente du contrôle.

Le `temp_admin` agit comme un admin **sauf** pour deux opérations sensibles :

1. **Il ne peut pas supprimer un autre administrateur** (`role = 'admin'`).
2. **Il ne peut pas modifier le rôle d'un administrateur** (le « rétrograder »
   ou « promouvoir » à autre chose).

Ainsi il peut faire toute la modération courante, l'édition de contenu, la
gestion des contributions, tout en étant dans l'incapacité de prendre le
contrôle définitif du système.

---

## 📐 Modèle de données

### Approche : enum + colonnes + table d'audit

#### A. Étendre l'enum `user_role`

```sql
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'temp_admin';
```

#### B. Colonnes sur `profiles`

```sql
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS temp_admin_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS temp_admin_granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS temp_admin_original_role user_role;
```

- `temp_admin_expires_at` : moment exact d'expiration (NOW() + 24h)
- `temp_admin_granted_by` : qui a accordé le pouvoir (admin)
- `temp_admin_original_role` : rôle d'origine pour pouvoir le restaurer

#### C. Table d'audit `temp_admin_grants`

```sql
CREATE TABLE temp_admin_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT,
  original_role user_role NOT NULL
);
```

Permet d'avoir l'historique complet : qui a été promu, par qui, quand,
révoqué tôt ou expiré naturellement.

---

## 🛡️ Règles de permission

### Helpers SQL

```sql
-- L'utilisateur est-il admin (vrai ou temporaire actif) ?
CREATE OR REPLACE FUNCTION is_admin_effectively(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_user_id
      AND (
        role = 'admin'
        OR (role = 'temp_admin' AND temp_admin_expires_at > NOW())
      )
  );
$$;

-- L'utilisateur est-il un VRAI admin (pas temp) ?
CREATE OR REPLACE FUNCTION is_real_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_user_id AND role = 'admin'
  );
$$;

-- L'utilisateur peut-il modifier (suppression / role change) le profil cible ?
CREATE OR REPLACE FUNCTION can_modify_profile(p_actor UUID, p_target UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    -- Vrai admin peut tout (sauf se supprimer lui-même : à gérer côté UI)
    is_real_admin(p_actor)
    OR (
      -- Temp admin actif peut modifier sauf si la cible est un vrai admin
      is_admin_effectively(p_actor)
      AND NOT is_real_admin(p_target)
    );
$$;
```

### Helpers TypeScript (`business.ts`)

```typescript
export const USER_ROLES = ["admin", "manager", "contributor", "user", "temp_admin"] as const;

export const ROLE_HIERARCHY = {
  admin: 100,
  temp_admin: 90,    // entre admin (100) et manager (50)
  manager: 50,
  contributor: 30,
  user: 10,
} as const;

/**
 * Le rôle effectif tient compte de l'expiration du temp_admin.
 * Si temp_admin a expiré, on retombe sur original_role.
 */
export function getEffectiveRole(profile: ProfileWithTempAdmin): UserRole {
  if (
    profile.role === "temp_admin" &&
    profile.temp_admin_expires_at &&
    new Date(profile.temp_admin_expires_at) > new Date()
  ) {
    return "admin"; // se comporte comme admin pour le runtime
  }
  if (profile.role === "temp_admin") {
    // Expiré → original_role (fallback user)
    return profile.temp_admin_original_role ?? "user";
  }
  return profile.role;
}

export function isTempAdminActive(profile: ProfileWithTempAdmin): boolean {
  return (
    profile.role === "temp_admin" &&
    !!profile.temp_admin_expires_at &&
    new Date(profile.temp_admin_expires_at) > new Date()
  );
}

export function canManageContent(role: UserRole | string | null): boolean {
  return ["admin", "manager", "temp_admin"].includes(role || "");
}

/**
 * Peut-on supprimer / modifier le rôle de target ?
 * temp_admin ne peut pas toucher aux vrais admins.
 */
export function canModifyUser(
  actor: ProfileWithTempAdmin,
  target: ProfileWithTempAdmin
): boolean {
  if (actor.role === "admin") return true; // vrai admin = tout-puissant
  if (isTempAdminActive(actor) && target.role !== "admin") return true;
  return false;
}
```

---

## 🔁 Cycle de vie d'un grant

```
┌──────────────────────────────────────────────────────────────┐
│  1. Admin va sur /admin/users                                 │
│  2. Sélectionne un user, clique "Promouvoir admin temp"       │
│  3. POST /api/admin/temp-grants {recipient_id, reason?}       │
│     → Insert temp_admin_grants                                 │
│     → UPDATE profiles SET                                      │
│         role = 'temp_admin',                                   │
│         temp_admin_expires_at = NOW() + INTERVAL '24h',        │
│         temp_admin_granted_by = <admin_id>,                    │
│         temp_admin_original_role = <previous_role>             │
│  4. Notification créée pour le user promu                      │
└──────────────────────────────────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│  5. Pendant 24h, l'utilisateur est un admin "presque complet" │
│     - Voit le Command Center                                   │
│     - Modère, édite, valide                                    │
│     - NE PEUT PAS supprimer un admin ni changer son rôle       │
│     - Voit un badge "Admin Temp · expire dans Xh Ymin"         │
└──────────────────────────────────────────────────────────────┘
                             ↓
        ┌─────────────────────┴───────────────────────┐
        ↓                                              ↓
┌──────────────────┐                       ┌──────────────────────┐
│  Expiration      │                       │  Révocation manuelle │
│  naturelle       │                       │  par un admin titul. │
│  (24h écoulées)  │                       │  (annulation early)  │
└────────┬─────────┘                       └─────────┬────────────┘
         ↓                                            ↓
┌──────────────────────────────────────────────────────────────┐
│  → is_admin_effectively() retourne false                       │
│  → Cron / job à la demande UPDATE :                            │
│      role = original_role,                                     │
│      temp_admin_* = null                                       │
│  → temp_admin_grants.revoked_at = NOW() si manuel              │
└──────────────────────────────────────────────────────────────┘
```

### Stratégie d'expiration

**Pas de cron strict requis** : `is_admin_effectively()` vérifie `expires_at > NOW()`
en temps réel. Donc même sans flush, un grant expiré n'a plus aucun effet.

Cela dit, on flushera le rôle à 2 occasions :

1. **Au login** : un trigger `on_session_start` ou un check dans `AuthProvider`
   détecte un `temp_admin` expiré et revert.
2. **À l'octroi d'un nouveau grant** : avant d'écraser, vérifier qu'il n'y avait
   pas un grant actif (et le revoke si oui).

Optionnel (post-v1) : Edge Function Supabase scheduled qui passe toutes les 6h
pour faire le ménage.

---

## 🎨 UI

### Page admin `/admin/users`

Tableau des users avec actions par ligne :

| Champ | Affichage |
|---|---|
| Avatar + nickname + username | Standard |
| Rôle effectif | `admin` / `temp_admin (Xh restantes)` / `manager` etc. |
| Action « Promouvoir admin temp » | Visible si user actuel est admin titulaire ET target n'est pas admin titulaire |
| Action « Révoquer admin temp » | Visible si target est temp_admin actif ET actor admin titulaire |

### Modal « Promouvoir admin temp »

- Récap du user choisi
- Champ **Raison** (optionnel mais recommandé) — sera dans audit
- Bouton **Confirmer** → POST API
- Information claire : « Pendant 24h, ce user pourra agir comme admin **sauf**
  supprimer ou modifier le rôle d'un autre admin. »

### Badge dans la Navbar

Quand un user est temp_admin actif, badge visible dans le UserMenu :

```
🛡️ Admin Temp · 21h 42min restantes
```

Animation pulse subtile or_ancestral à 1h restante.

### Page profil

Si user actuel est temp_admin actif, message dédié dans `/profil` :

> Vous êtes administrateur temporaire jusqu'au 29 avril 2026 à 18h32.
> Accordé par : Le batisseur · Raison : « Couverture pendant mon voyage »

---

## 🔐 Sécurité

### Règles non négociables

1. **Seul un admin titulaire** peut accorder ou révoquer un temp_admin.
2. **Un temp_admin ne peut pas accorder** d'autres temp_admin (anti-cascade).
3. **Un temp_admin ne peut pas se prolonger lui-même.**
4. **Un temp_admin ne peut pas supprimer un admin** ni changer son rôle.
5. **Toute action de temp_admin** est loggée dans `moderation_logs` ou
   `activity_log` avec un flag `actor_was_temp_admin: true`.

### RLS critiques à mettre à jour

#### `profiles` UPDATE

Empêcher temp_admin de toucher au rôle d'un admin titulaire :

```sql
DROP POLICY IF EXISTS "profiles_role_update" ON profiles;
CREATE POLICY "profiles_role_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    -- Soi-même (champs non-role) ou via fonctions adm
    id = auth.uid()
    OR can_modify_profile(auth.uid(), id)
  )
  WITH CHECK (
    id = auth.uid()
    OR can_modify_profile(auth.uid(), id)
  );
```

#### `temp_admin_grants`

```sql
ALTER TABLE temp_admin_grants ENABLE ROW LEVEL SECURITY;

-- Admin titulaire seul peut INSERT
CREATE POLICY "grants_insert_admin_only"
  ON temp_admin_grants FOR INSERT
  TO authenticated
  WITH CHECK (is_real_admin(auth.uid()));

-- Le récipiendaire et tous les admins peuvent SELECT
CREATE POLICY "grants_select_recipient_or_admin"
  ON temp_admin_grants FOR SELECT
  TO authenticated
  USING (
    recipient_id = auth.uid()
    OR is_admin_effectively(auth.uid())
  );

-- Admin titulaire seul peut UPDATE (pour révoquer)
CREATE POLICY "grants_update_admin_only"
  ON temp_admin_grants FOR UPDATE
  TO authenticated
  USING (is_real_admin(auth.uid()))
  WITH CHECK (is_real_admin(auth.uid()));
```

---

## 📅 Plan d'exécution (1 sprint)

### Sprint unique — 3 jours

#### Jour 1 — DB foundation

- [ ] Migration : enum + colonnes profiles + table grants
- [ ] Helpers SQL : `is_admin_effectively`, `is_real_admin`, `can_modify_profile`
- [ ] RLS sur grants
- [ ] Update RLS critiques sur profiles

#### Jour 2 — Backend & helpers

- [ ] `business.ts` : USER_ROLES, ROLE_HIERARCHY, helpers TS
- [ ] `AuthProvider` : exposer `effectiveRole`, `tempAdminExpiresAt`, `isTempAdminActive`
- [ ] API routes :
  - `POST /api/admin/temp-grants`
  - `DELETE /api/admin/temp-grants/[id]` (révocation)
  - `GET /api/admin/temp-grants` (historique)
- [ ] Refactor des checks de rôle dans le code (utiliser `canManageContent` partout au lieu de comparer en dur)

#### Jour 3 — UI & polish

- [ ] Page `/admin/users` enrichie : colonne rôle effectif + actions
- [ ] Modal promotion avec champ raison
- [ ] Badge "Admin Temp" dans Navbar avec countdown
- [ ] Notif au user promu
- [ ] Documentation interne (admin doc) à jour

---

## 🧪 Tests à valider

| Cas | Comportement attendu |
|---|---|
| Admin promeut user → user devient temp_admin | ✅ Rôle change, expires_at = NOW()+24h |
| Temp_admin essaie de promouvoir un user | ❌ 403 |
| Temp_admin essaie de supprimer admin titulaire | ❌ 403 |
| Temp_admin essaie de changer le role d'un admin titulaire | ❌ 403 |
| Temp_admin supprime un manager | ✅ OK |
| Temp_admin supprime un autre temp_admin | ✅ OK |
| Temp_admin se promeut lui-même | ❌ 403 |
| 24h écoulées → temp_admin tente d'agir | ❌ 403 (RLS bloque) |
| Admin révoque tôt | ✅ Rôle revert à original_role immédiatement |

---

## ⚠️ Risques

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Temp_admin malveillant pourrit le contenu | Faible (admin choisit qui) | Haut | Audit log de toutes les actions, révocation immédiate possible |
| Un admin promeut par erreur | Moyenne | Moyen | Modal de confirmation + notification au user promu |
| Race condition à l'expiration | Faible | Faible | RLS check NOW() à chaque requête, pas de cache |
| Plusieurs grants actifs simultanés | Possible | Faible | À l'INSERT, revoke tout grant actif précédent du même user |

---

## 🎯 Métriques de succès

- Combien de temp_admin sont accordés par mois ?
- Sont-ils utilisés pour des actions effectives (vs grants oubliés) ?
- Ratio expirés-naturels vs révoqués-tôt
- Aucune escalade non autorisée détectée

---

*« Confier le tambour pour une nuit, c'est aussi savoir comment le récupérer au matin. »*
