import { supabase } from "./supabase";

export type ActivityType = 
  | "login" 
  | "comment" 
  | "like" 
  | "upload" 
  | "view_article" 
  | "admin_action";

export async function logUserActivity(userId: string, type: ActivityType, details: string = "") {
  try {
    // 1. Get current metadata
    const { data: profile } = await supabase
      .from("profiles")
      .select("metadata")
      .eq("id", userId)
      .single();

    const metadata = profile?.metadata || {};
    const activities = metadata.activities || [];

    // 2. Append new activity
    const newActivity = {
      type,
      details,
      timestamp: new Date().toISOString()
    };

    // Keep only last 50 activities to save space
    const updatedActivities = [newActivity, ...activities].slice(0, 50);

    // 3. Update profile
    await supabase
      .from("profiles")
      .update({ 
        metadata: { ...metadata, activities: updatedActivities },
        updated_at: new Date().toISOString()
      })
      .eq("id", userId);

  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}
