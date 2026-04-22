"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
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
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            <div style="background: var(--foret-nocturne); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #C16B34; margin: 0;">Sakata Digital</h1>
              <p style="color: var(--ivoire-ancien); opacity: 0.6; margin: 10px 0 0;">Mise à jour v${version}</p>
            </div>
            <div style="padding: 40px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 12px 12px;">
              ${content.replace(/\n/g, '<br/>')}
              <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;"/>
              <p style="font-size: 12px; color: #999; text-align: center;">
                Vous recevez cet email car vous êtes membre du Sakata Digital Hub.<br/>
                &copy; ${new Date().getFullYear()} Sakata Digital Hub
              </p>
            </div>
          </div>
        `,
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
