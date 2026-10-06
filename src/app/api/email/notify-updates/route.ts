import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DB_TABLES } from "@/lib/constants/db";
import { emailTemplates, getPhase2Updates } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/resend";
import { USER_ROLES } from "@/lib/constants/business";
import { emailNotifySchema } from "@/lib/schemas/validation";

// Envois simultanés max vers Resend (un message par destinataire)
const SEND_CONCURRENCY = 5;

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
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

    // Get current user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("⚠️ Email API: Unauthorized attempt (no auth session)");
      return NextResponse.json(
        { error: "Unauthorized: Not authenticated" },
        { status: 401 }
      );
    }

    // Get user profile to verify admin role
    const { data: profile, error: profileError } = await supabase
      .from(DB_TABLES.PROFILES)
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== USER_ROLES.ADMIN) {
      console.warn(`⚠️ Email API: Forbidden attempt from ${user.email} (role: ${profile?.role})`);
      return NextResponse.json(
        { error: "Forbidden: Admin role required" },
        { status: 403 }
      );
    }

    console.log(`✅ Email API: Admin ${user.email} authorized`);

    const body = await req.json();
    const validated = emailNotifySchema.parse(body);
    const updateType = validated.updateType || "phase2";
    const subject = validated.subject;

    // Refuse honestly instead of pretending to send when no transport is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("Email API: RESEND_API_KEY missing — no email sent");
      return NextResponse.json(
        { error: "Email transport not configured (RESEND_API_KEY missing)", sent: 0 },
        { status: 503 }
      );
    }

    // Get all registered users (exclude admin/test accounts if needed)
    const { data: profiles, error: profilesError } = await supabase
      .from(DB_TABLES.PROFILES)
      .select("id, email, username, nickname")
      .not("email", "is", null);

    if (profilesError) {
      console.error("Email API: profiles fetch failed:", profilesError);
      return NextResponse.json(
        { error: "Failed to load recipients", sent: 0 },
        { status: 500 }
      );
    }

    if (!profiles || profiles.length === 0) {
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

    // One message per recipient (never expose other members' addresses)
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < profiles.length; i += SEND_CONCURRENCY) {
      const batch = profiles.slice(i, i + SEND_CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map((profile) => {
          const userName = profile.nickname || profile.username || "Utilisateur";
          const emailContent = emailTemplates.updateNotification(userName, updates);
          return sendEmail({
            to: profile.email,
            subject: subject || emailContent.subject,
            html: emailContent.html,
          });
        })
      );
      for (const r of results) {
        if (r.status === "fulfilled" && r.value?.id) sent++;
        else failed++;
      }
    }

    console.log(`📧 Email API: ${sent}/${profiles.length} ${updateType} emails accepted (${failed} failed)`);

    if (sent === 0) {
      return NextResponse.json(
        { error: "No email was accepted by the provider", sent: 0, failed, updateType },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        sent,
        failed,
        message: `Notified ${sent} of ${profiles.length} users`,
        updateType,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Email notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
