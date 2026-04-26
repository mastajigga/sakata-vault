#!/usr/bin/env node
/**
 * Direct conversation deletion script
 * Usage: npx ts-node scripts/delete-conversation.ts <conversation-id>
 *
 * This script allows direct deletion of a conversation from the database.
 * Use this when the UI delete button is not working.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in environment variables");
  console.error("Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteConversationByDate(name: string, dateStr: string) {
  try {
    console.log(`🔍 Searching for conversation: "${name}" from ${dateStr}...`);

    // Parse date (format: 12/04/2026 or 2026-04-12)
    let targetDate: Date;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      targetDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      targetDate = new Date(dateStr);
    }

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find the conversation
    const { data: conversations, error: searchError } = await supabase
      .from("chat_conversations")
      .select("id, type, name, created_at")
      .like("name", `%${name}%`)
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());

    if (searchError) {
      console.error("❌ Search error:", searchError);
      process.exit(1);
    }

    if (!conversations || conversations.length === 0) {
      console.error(`❌ No conversation found matching "${name}" on ${dateStr}`);
      process.exit(1);
    }

    if (conversations.length > 1) {
      console.warn(`⚠️  Found ${conversations.length} conversations matching criteria:`);
      conversations.forEach((c) => {
        console.log(`   - ${c.name} (${new Date(c.created_at).toLocaleString("fr-FR")})`);
      });
      console.error("Please be more specific or use the conversation ID directly");
      process.exit(1);
    }

    const target = conversations[0];
    console.log(`✅ Found: "${target.name}" (${new Date(target.created_at).toLocaleString("fr-FR")})`);
    console.log(`   ID: ${target.id}`);
    console.log("");

    // Delete chat_participants
    console.log("🗑️  Deleting chat participants...");
    const { error: deleteParticipantsError } = await supabase
      .from("chat_participants")
      .delete()
      .eq("conversation_id", target.id);

    if (deleteParticipantsError) {
      console.error("❌ Error deleting participants:", deleteParticipantsError);
      process.exit(1);
    }
    console.log("✅ Participants deleted");

    // Delete chat_conversations
    console.log("🗑️  Deleting conversation...");
    const { error: deleteConvError } = await supabase
      .from("chat_conversations")
      .delete()
      .eq("id", target.id);

    if (deleteConvError) {
      console.error("❌ Error deleting conversation:", deleteConvError);
      process.exit(1);
    }
    console.log("✅ Conversation deleted");
    console.log("");
    console.log("✨ Deletion complete!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    process.exit(1);
  }
}

// Get arguments
const [, , conversationName, dateStr] = process.argv;

if (!conversationName || !dateStr) {
  console.log("Usage: npx ts-node scripts/delete-conversation.ts <name> <date>");
  console.log("Example: npx ts-node scripts/delete-conversation.ts '409e' '12/04/2026'");
  console.log("Or:      npx ts-node scripts/delete-conversation.ts '409e' '2026-04-12'");
  process.exit(1);
}

deleteConversationByDate(conversationName, dateStr);
