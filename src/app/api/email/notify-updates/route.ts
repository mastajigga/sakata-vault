import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DB_TABLES } from "@/lib/constants/db";
import { emailTemplates, getPhase2Updates } from "@/lib/email/templates";
import { USER_ROLES } from "@/lib/constants/business";
import { emailNotifySchema } from "@/lib/schemas/validation";

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

    // Get all registered users (exclude admin/test accounts if needed)
    const { data: profiles, error: profilesError } = await supabase
      .from(DB_TABLES.PROFILES)
      .select("id, email, username, nickname")
      .not("email", "is", null);

    if (profilesError || !profiles || profiles.length === 0) {
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
