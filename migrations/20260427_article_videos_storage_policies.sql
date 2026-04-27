-- Migration: Storage RLS for article-videos bucket
-- Date: 2026-04-27
-- Description: Allows admin/manager users to upload videos directly from
--              the browser to Supabase Storage, bypassing Netlify Functions
--              (which have a ~6MB payload limit unsuitable for video files).
--
-- Required because the previous flow uploaded via /api/admin/articles/upload-hero-video,
-- which ran into Netlify's body-size limit and returned 500 for any non-trivial video.

DROP POLICY IF EXISTS "article_videos_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "article_videos_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "article_videos_admin_delete" ON storage.objects;
DROP POLICY IF EXISTS "article_videos_public_select" ON storage.objects;

-- INSERT: admin/manager profiles only
CREATE POLICY "article_videos_admin_insert"
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

-- UPDATE: admin/manager profiles only (e.g. replace video)
CREATE POLICY "article_videos_admin_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'article-videos'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
  )
)
WITH CHECK (
  bucket_id = 'article-videos'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
  )
);

-- DELETE: admin/manager profiles only
CREATE POLICY "article_videos_admin_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'article-videos'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
  )
);

-- SELECT: public read (bucket is public, but explicit policy clarifies intent)
CREATE POLICY "article_videos_public_select"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'article-videos');
