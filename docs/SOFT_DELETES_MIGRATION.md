# Soft Deletes & Archive Implementation — Phase 3.F

## Overview
This migration adds soft delete support to key tables (`chat_messages`, `articles`, `forum_threads`) to preserve data while hiding deleted content. Deleted items can be restored by administrators.

## Schema Changes

### 1. chat_messages (EXISTING)
Column `is_deleted` already exists. Ensure:
- Default: `false`
- Type: `boolean`
- Used in: `useMessages.ts` filtering

### 2. articles
Add column:
```sql
ALTER TABLE articles ADD COLUMN deleted_at TIMESTAMP NULL;
```

Filter logic:
```sql
WHERE deleted_at IS NULL
```

### 3. forum_threads
Add column:
```sql
ALTER TABLE forum_threads ADD COLUMN deleted_at TIMESTAMP NULL;
```

Filter logic:
```sql
WHERE deleted_at IS NULL
```

### 4. forum_posts
Add column:
```sql
ALTER TABLE forum_posts ADD COLUMN deleted_at TIMESTAMP NULL;
```

Filter logic:
```sql
WHERE deleted_at IS NULL
```

## Implementation Status

### Chat Messages ✅
- Soft delete column: `is_deleted` (boolean)
- Filtering: Already implemented in `useMessages.ts`
- Delete logic: Not yet implemented in UI

### Articles 🔄
- Soft delete column: `deleted_at` needs implementation
- Filtering: Needs implementation in article fetch routes
- Delete logic: Needs UI button in article editor

### Forum 🔄
- Soft delete columns: `deleted_at` needed on `forum_threads` and `forum_posts`
- Filtering: Needs implementation in forum routes
- Delete logic: Needs UI buttons in thread/post components

## Admin Recovery Interface

Create `/app/admin/archive` page to:
1. List deleted articles (with recovery button)
2. List deleted forum threads (with recovery button)
3. List deleted chat messages (with recovery option)

Recovery function:
```typescript
// For articles
UPDATE articles SET deleted_at = NULL WHERE id = $1

// For forum_threads
UPDATE forum_threads SET deleted_at = NULL WHERE id = $1

// For forum_posts
UPDATE forum_posts SET deleted_at = NULL WHERE id = $1

// For chat_messages
UPDATE chat_messages SET is_deleted = false WHERE id = $1
```

## Files to Update

- `src/app/api/articles/route.ts` — Add deleted_at filter
- `src/app/api/articles/[slug]/route.ts` — Add deleted_at filter
- `src/components/ArticleEditor.tsx` — Add soft delete on save
- `src/app/savoir/page.tsx` — Filter deleted articles
- `src/app/forum/[category_slug]/page.tsx` — Filter deleted threads
- `src/components/forum/ThreadCard.tsx` — Handle deleted display
- `src/app/admin/articles/page.tsx` — Add delete button
- `src/app/admin/archive/page.tsx` — New admin recovery interface

## Testing Checklist

- [ ] Delete an article → verify it doesn't appear in `/savoir`
- [ ] Delete a forum thread → verify it doesn't appear in forum
- [ ] Delete a message → verify it shows as deleted in chat
- [ ] Recover article → verify it reappears in `/savoir`
- [ ] Recover thread → verify it reappears in forum
- [ ] Recover message → verify it reappears in chat
- [ ] Verify only admins can access recovery interface
