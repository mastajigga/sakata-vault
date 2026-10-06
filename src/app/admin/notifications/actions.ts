"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { emailTemplates } from "@/lib/email/templates";
import { getCurrentAuthUser } from "@/lib/api/auth-helpers";
import { canManageContent } from "@/lib/constants/business";
import { DB_TABLES } from "@/lib/constants/db";
import { revalidatePath } from "next/cache";

interface BroadcastEmailParams {
  subject: string;
  content: string; // HTML content from the editor
  version: string;
}

// Envois simultanés max vers Resend (un message par destinataire)
const SEND_CONCURRENCY = 5;
const LIST_USERS_PAGE_SIZE = 1000;

export async function broadcastUpdateEmail({ subject, content, version }: BroadcastEmailParams) {
  try {
    // 0. Server-side authorization — the /admin layout guard is client-only.
    // Same audience as the "Notifications" admin nav entry: admin, manager, active temp_admin.
    const caller = await getCurrentAuthUser();
    if (!caller) {
      return { success: false, error: "Non autorisé" };
    }

    const { data: callerProfile, error: profileError } = await supabaseAdmin
      .from(DB_TABLES.PROFILES)
      .select("role, temp_admin_expires_at, temp_admin_original_role")
      .eq("id", caller.id)
      .single();

    if (profileError) {
      console.error("Broadcast: caller profile lookup failed:", profileError);
      return { success: false, error: "Non autorisé" };
    }
    if (!callerProfile || !canManageContent(callerProfile)) {
      console.warn(`Broadcast: forbidden attempt from ${caller.id}`);
      return { success: false, error: "Non autorisé" };
    }

    // 1. Fetch all members with accounts from Supabase Auth (paginated)
    const emails: string[] = [];
    for (let page = 1; ; page++) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: LIST_USERS_PAGE_SIZE,
      });

      if (error) {
        console.error("Supabase Auth Error:", error);
        return { success: false, error: "Impossible de récupérer la liste des membres." };
      }

      for (const u of data.users) {
        if (u.email) emails.push(u.email);
      }
      if (data.users.length < LIST_USERS_PAGE_SIZE) break;
    }

    if (emails.length === 0) {
      return { success: false, error: "Aucun membre avec un email valide trouvé." };
    }

    // 2. One message per recipient — never put several member addresses in `to`
    // (every recipient would see all the others).
    const html = emailTemplates.broadcastTemplate(content, version).html;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emails.length; i += SEND_CONCURRENCY) {
      const batch = emails.slice(i, i + SEND_CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map((to) => sendEmail({ to, subject, html }))
      );
      for (const r of results) {
        if (r.status === "fulfilled" && r.value?.id) sent++;
        else failed++;
      }
    }

    if (failed > 0) {
      console.error(`Broadcast: ${failed}/${emails.length} email(s) rejected`);
    }

    revalidatePath("/admin/notifications");

    if (sent === 0) {
      return { success: false, error: "Aucun email n'a été accepté. Vérifiez vos configurations Resend.", count: 0 };
    }
    return { success: true, count: sent, failed };
  } catch (err: any) {
    console.error("Broadcast failed:", err);
    return { success: false, error: err.message || "L'envoi a échoué. Vérifiez vos configurations Resend." };
  }
}
