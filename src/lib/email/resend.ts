import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

/**
 * Envoie un email via Resend.
 * Sur le domaine sakata.com si configuré, sinon via resend.dev pour les tests.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Sakata Digital <notifications@sakata-basakata.com>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (err: any) {
    console.error("Email send failed:", err);
    throw err;
  }
}
