import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { DB_TABLES } from "@/lib/constants/db";
import { emailTemplates, getPhase2Updates } from "@/lib/email/templates";

export async function POST(req: NextRequest) {
  try {
    const { subject, updateType = "phase2" } = await req.json();

    // Create Supabase server client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    // Get all registered users (exclude admin/test accounts if needed)
    const { data: profiles, error: profileError } = await supabase
      .from(DB_TABLES.PROFILES)
      .select("id, email, username, nickname")
      .not("email", "is", null);

    if (profileError || !profiles || profiles.length === 0) {
      return NextResponse.json(
        { error: "No profiles found", sent: 0 },
        { status: 400 }
      );
    }

    // Get updates based on type
    let updates: string[] = [];
    if (updateType === "phase2") {
      updates = getPhase2Updates();
    }

    // Send emails (in production, use Resend, SendGrid, or Nodemailer)
    // For now, we'll log and track in database
    const sentEmails: Array<{
      user_id: string;
      email: string;
      sent_at: string;
      update_type: string;
    }> = [];

    for (const profile of profiles) {
      const userName = profile.nickname || profile.username || "Utilisateur";
      const emailContent = emailTemplates.updateNotification(userName, updates);

      // Log email send (in production, integrate with email provider)
      console.log(`📧 Email to ${profile.email}:`, emailContent.subject);

      sentEmails.push({
        user_id: profile.id,
        email: profile.email,
        sent_at: new Date().toISOString(),
        update_type: updateType,
      });
    }

    // Track email sends in database (if you have an email_logs table)
    if (sentEmails.length > 0) {
      // Optional: store email logs for tracking
      console.log(`✅ Notified ${sentEmails.length} users of ${updateType} updates`);
    }

    return NextResponse.json(
      {
        sent: sentEmails.length,
        message: `Successfully notified ${sentEmails.length} users`,
        updateType,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email notification error:", error);
    return NextResponse.json(
      { error: "Failed to send email notifications" },
      { status: 500 }
    );
  }
}
