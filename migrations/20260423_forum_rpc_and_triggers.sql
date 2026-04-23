-- Migration: Forum RPC and Triggers
-- Description: Adds increment_thread_views function and a trigger to update thread timestamp on new posts.

-- 1. Function to increment thread views safely
CREATE OR REPLACE FUNCTION increment_thread_views(t_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE forum_threads
  SET views_count = views_count + 1
  WHERE id = t_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Function to update thread updated_at timestamp
CREATE OR REPLACE FUNCTION handle_new_forum_post()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_threads
  SET updated_at = timezone('utc'::text, now())
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger on forum_posts
DROP TRIGGER IF EXISTS on_forum_post_created ON forum_posts;
CREATE TRIGGER on_forum_post_created
  AFTER INSERT ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_forum_post();
