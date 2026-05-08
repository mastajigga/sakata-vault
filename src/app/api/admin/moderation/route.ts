import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireModerator, requireFullAdmin } from "@/lib/api/auth-helpers";
import { BAN_DURATIONS_HOURS, SOFT_DELETE_GRACE_DAYS, MODERATION_ACTIONS } from "@/lib/constants/business";

export const dynamic = "force-dynamic";

const baseSchema = z.object({
  action: z.enum([
    "delete_post",
    "delete_thread",
    "warn_user",
    "ban_user",
    "unban_user",
    "soft_delete_user",
    "restore_user",
    "resolve_report",
    "dismiss_report",
  ]),
  postId: z.string().uuid().optional(),
  threadId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  reportId: z.string().uuid().optional(),
  reason: z.string().min(1, "Raison requise").max(1000).optional(),
  message: z.string().min(1).max(2000).optional(),
  durationHours: z.union([z.literal(24), z.literal(48), z.literal(72)]).optional(),
  usernameConfirm: z.string().optional(),
});

async function logAction(params: {
  moderator_id: string;
  moderator_role: string;
  action_type: string;
  target_user_id?: string | null;
  target_post_id?: string | null;
  target_thread_id?: string | null;
  target_report_id?: string | null;
  reason?: string | null;
  duration_hours?: number | null;
  expires_at?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  await supabaseAdmin.from("moderation_logs").insert({
    moderator_id: params.moderator_id,
    moderator_role: params.moderator_role,
    action_type: params.action_type,
    target_user_id: params.target_user_id ?? null,
    target_post_id: params.target_post_id ?? null,
    target_thread_id: params.target_thread_id ?? null,
    target_report_id: params.target_report_id ?? null,
    reason: params.reason ?? null,
    duration_hours: params.duration_hours ?? null,
    expires_at: params.expires_at ?? null,
    metadata: params.metadata ?? null,
  });
}

export async function POST(req: Request) {
  const auth = await requireModerator();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: z.infer<typeof baseSchema>;
  try {
    body = baseSchema.parse(await req.json());
  } catch (e: any) {
    return NextResponse.json({ error: e.issues?.[0]?.message || "Paramètres invalides" }, { status: 400 });
  }

  const { user, effectiveRole } = auth;
  const moderatorRole = effectiveRole;

  try {
    switch (body.action) {
      case "delete_post": {
        if (!body.postId || !body.reason)
          return NextResponse.json({ error: "postId + reason requis" }, { status: 400 });

        const { data: post } = await supabaseAdmin
          .from("forum_posts")
          .select("id, author_id, thread_id")
          .eq("id", body.postId)
          .single();
        if (!post) return NextResponse.json({ error: "Post introuvable" }, { status: 404 });

        await supabaseAdmin
          .from("forum_posts")
          .update({
            deleted_at: new Date().toISOString(),
            deleted_by: user.id,
            deletion_reason: body.reason,
          })
          .eq("id", body.postId);

        if (body.reportId) {
          await supabaseAdmin
            .from("moderation_reports")
            .update({ status: "resolved", reviewed_by: user.id, reviewed_at: new Date().toISOString() })
            .eq("id", body.reportId);
        }

        await logAction({
          moderator_id: user.id,
          moderator_role: moderatorRole,
          action_type: MODERATION_ACTIONS.DELETE_POST,
          target_user_id: post.author_id,
          target_post_id: body.postId,
          target_thread_id: post.thread_id,
          target_report_id: body.reportId,
          reason: body.reason,
        });
        return NextResponse.json({ ok: true });
      }

      case "delete_thread": {
        if (!body.threadId || !body.reason)
          return NextResponse.json({ error: "threadId + reason requis" }, { status: 400 });

        const { data: thread } = await supabaseAdmin
          .from("forum_threads")
          .select("id, author_id")
          .eq("id", body.threadId)
          .single();
        if (!thread) return NextResponse.json({ error: "Sujet introuvable" }, { status: 404 });

        await supabaseAdmin
          .from("forum_threads")
          .update({
            deleted_at: new Date().toISOString(),
            deleted_by: user.id,
            deletion_reason: body.reason,
          })
          .eq("id", body.threadId);

        await logAction({
          moderator_id: user.id,
          moderator_role: moderatorRole,
          action_type: MODERATION_ACTIONS.DELETE_THREAD,
          target_user_id: thread.author_id,
          target_thread_id: body.threadId,
          reason: body.reason,
        });
        return NextResponse.json({ ok: true });
      }

      case "warn_user": {
        if (!body.userId || !body.message)
          return NextResponse.json({ error: "userId + message requis" }, { status: 400 });

        const { data: warning, error } = await supabaseAdmin
          .from("moderation_warnings")
          .insert({
            user_id: body.userId,
            moderator_id: user.id,
            message: body.message,
            related_post_id: body.postId ?? null,
          })
          .select()
          .single();
        if (error) throw error;

        await logAction({
          moderator_id: user.id,
          moderator_role: moderatorRole,
          action_type: MODERATION_ACTIONS.WARN_USER,
          target_user_id: body.userId,
          target_post_id: body.postId,
          reason: body.message,
          metadata: { warning_id: warning.id },
        });
        return NextResponse.json({ ok: true, warning });
      }

      case "ban_user": {
        if (!body.userId || !body.durationHours || !body.reason)
          return NextResponse.json({ error: "userId + durationHours + reason requis" }, { status: 400 });
        if (!BAN_DURATIONS_HOURS.includes(body.durationHours))
          return NextResponse.json({ error: "Durée invalide (24/48/72)" }, { status: 400 });

        if (body.userId === user.id)
          return NextResponse.json({ error: "Vous ne pouvez pas vous bannir vous-même" }, { status: 400 });

        const { data: target } = await supabaseAdmin
          .from("profiles")
          .select("id, role")
          .eq("id", body.userId)
          .single();
        if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
        if (target.role === "admin")
          return NextResponse.json({ error: "Impossible de bannir un administrateur" }, { status: 403 });

        const expiresAt = new Date(Date.now() + body.durationHours * 60 * 60 * 1000).toISOString();
        await supabaseAdmin
          .from("profiles")
          .update({
            banned_until: expiresAt,
            ban_reason: body.reason,
            banned_by: user.id,
          })
          .eq("id", body.userId);

        await logAction({
          moderator_id: user.id,
          moderator_role: moderatorRole,
          action_type: MODERATION_ACTIONS.BAN_USER,
          target_user_id: body.userId,
          reason: body.reason,
          duration_hours: body.durationHours,
          expires_at: expiresAt,
        });
        return NextResponse.json({ ok: true, expires_at: expiresAt });
      }

      case "unban_user": {
        if (!body.userId)
          return NextResponse.json({ error: "userId requis" }, { status: 400 });

        await supabaseAdmin
          .from("profiles")
          .update({ banned_until: null, ban_reason: null, banned_by: null })
          .eq("id", body.userId);

        await logAction({
          moderator_id: user.id,
          moderator_role: moderatorRole,
          action_type: MODERATION_ACTIONS.UNBAN_USER,
          target_user_id: body.userId,
          reason: body.reason ?? "Débannissement manuel",
        });
        return NextResponse.json({ ok: true });
      }

      case "soft_delete_user": {
        if (!body.userId || !body.reason || !body.usernameConfirm)
          return NextResponse.json({ error: "userId + reason + usernameConfirm requis" }, { status: 400 });
        if (body.userId === user.id)
          return NextResponse.json({ error: "Vous ne pouvez pas vous supprimer vous-même" }, { status: 400 });

        const { data: target } = await supabaseAdmin
          .from("profiles")
          .select("id, role, username")
          .eq("id", body.userId)
          .single();
        if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
        if (target.role === "admin")
          return NextResponse.json({ error: "Impossible de supprimer un administrateur" }, { status: 403 });
        if ((target.username || "").toLowerCase() !== body.usernameConfirm.toLowerCase())
          return NextResponse.json({ error: "Confirmation du username incorrecte" }, { status: 400 });

        const now = new Date();
        const purgeAt = new Date(now.getTime() + SOFT_DELETE_GRACE_DAYS * 24 * 60 * 60 * 1000).toISOString();
        await supabaseAdmin
          .from("profiles")
          .update({
            deleted_at: now.toISOString(),
            deleted_by: user.id,
            deletion_reason: body.reason,
            permanent_delete_at: purgeAt,
          })
          .eq("id", body.userId);

        await logAction({
          moderator_id: user.id,
          moderator_role: moderatorRole,
          action_type: MODERATION_ACTIONS.SOFT_DELETE_USER,
          target_user_id: body.userId,
          reason: body.reason,
          metadata: { permanent_delete_at: purgeAt },
        });
        return NextResponse.json({ ok: true, permanent_delete_at: purgeAt });
      }

      case "restore_user": {
        // Only full admin can restore
        const adm = await requireFullAdmin();
        if ("error" in adm)
          return NextResponse.json({ error: adm.error }, { status: adm.status });

        if (!body.userId)
          return NextResponse.json({ error: "userId requis" }, { status: 400 });

        await supabaseAdmin
          .from("profiles")
          .update({
            deleted_at: null,
            deleted_by: null,
            deletion_reason: null,
            permanent_delete_at: null,
          })
          .eq("id", body.userId);

        await logAction({
          moderator_id: user.id,
          moderator_role: moderatorRole,
          action_type: MODERATION_ACTIONS.RESTORE_USER,
          target_user_id: body.userId,
          reason: body.reason ?? "Restauration manuelle",
        });
        return NextResponse.json({ ok: true });
      }

      case "resolve_report": {
        if (!body.reportId)
          return NextResponse.json({ error: "reportId requis" }, { status: 400 });
        await supabaseAdmin
          .from("moderation_reports")
          .update({ status: "resolved", reviewed_by: user.id, reviewed_at: new Date().toISOString() })
          .eq("id", body.reportId);

        await logAction({
          moderator_id: user.id,
          moderator_role: moderatorRole,
          action_type: MODERATION_ACTIONS.RESOLVE_REPORT,
          target_report_id: body.reportId,
          reason: body.reason ?? null,
        });
        return NextResponse.json({ ok: true });
      }

      case "dismiss_report": {
        if (!body.reportId)
          return NextResponse.json({ error: "reportId requis" }, { status: 400 });
        await supabaseAdmin
          .from("moderation_reports")
          .update({ status: "dismissed", reviewed_by: user.id, reviewed_at: new Date().toISOString() })
          .eq("id", body.reportId);

        await logAction({
          moderator_id: user.id,
          moderator_role: moderatorRole,
          action_type: MODERATION_ACTIONS.DISMISS_REPORT,
          target_report_id: body.reportId,
          reason: body.reason ?? null,
        });
        return NextResponse.json({ ok: true });
      }
    }
  } catch (err: any) {
    console.error("[moderation API]", err);
    return NextResponse.json({ error: err.message || "Erreur serveur" }, { status: 500 });
  }
}
