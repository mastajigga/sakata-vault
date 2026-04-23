"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { emailTemplates } from "@/lib/email/templates";
import { revalidatePath } from "next/cache";

interface BroadcastEmailParams {
  subject: string;
  content: string; // HTML content from the editor
  version: string;
}

export async function broadcastUpdateEmail({ subject, content, version }: BroadcastEmailParams) {
  try {
    // 1. Fetch all members with accounts from Supabase Auth
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error("Supabase Auth Error:", error);
      return { success: false, error: "Impossible de récupérer la liste des membres." };
    }

    if (!users || users.length === 0) {
      return { success: false, error: "Aucun membre trouvé dans la forêt numérique." };
    }

    // 2. Extract emails
    const emails = users
      .map(u => u.email)
      .filter((e): e is string => !!e);

    if (emails.length === 0) {
      return { success: false, error: "Aucun email valide trouvé." };
    }

    // 3. Send using Resend (Batching if necessary, but Resend handles up to 50 recipients in 'to')
    // Pour une meilleure expérience, on pourrait envoyer individuellement ou par tranches de 50.
    // Pour l'instant, envoyons par tranches de 50 pour respecter les limites standard de Resend 'to' array.
    const chunkedEmails = [];
    for (let i = 0; i < emails.length; i += 50) {
      chunkedEmails.push(emails.slice(i, i + 50));
    }

    const sendPromises = chunkedEmails.map(chunk => 
      sendEmail({
        to: chunk,
        subject: subject,
        html: emailTemplates.broadcastTemplate(content, version).html,
      })
    );

    await Promise.all(sendPromises);

    revalidatePath("/admin/notifications");
    return { success: true, count: emails.length };
  } catch (err: any) {
    console.error("Broadcast failed:", err);
    return { success: false, error: err.message || "L'envoi a échoué. Vérifiez vos configurations Resend." };
  }
}
