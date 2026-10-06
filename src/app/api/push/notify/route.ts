import { getCurrentAuthUser } from "@/lib/api/auth-helpers";
import { NextRequest, NextResponse } from "next/server";
import * as webpush from "web-push";
import { z } from "zod";
import { DB_TABLES } from "@/lib/constants/db";
import { pushNotifyRouteSchema } from "@/lib/schemas/validation";

// Configure web-push with VAPID (optional for production)
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:sakata@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(req: NextRequest) {
  try {
    const { user, supabase } = await getCurrentAuthUser({ withClient: true });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Skip if VAPID not configured
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return NextResponse.json({ sent: 0 });
    }

    const body = await req.json();
    const validated = pushNotifyRouteSchema.parse(body);
    const { conversationId, senderName, messagePreview, senderId } = validated;

    // Get all participants in the conversation
    const { data: participants, error: participantsError } = await supabase
      .from(DB_TABLES.CHAT_PARTICIPANTS)
      .select("user_id")
      .eq("conversation_id", conversationId)
      .neq("user_id", senderId); // Don't notify sender

    if (participantsError) throw participantsError;

    if (!participants || participants.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    // Get push subscriptions for all participants
    const userIds = participants.map((p: any) => p.user_id);
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from(DB_TABLES.PUSH_SUBSCRIPTIONS)
      .select("id, endpoint, p256dh, auth")
      .in("user_id", userIds);

    if (subscriptionsError) throw subscriptionsError;

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    // Send notifications to all subscribed users
    let sentCount = 0;
    const failedEndpoints: string[] = [];

    for (const sub of subscriptions) {
      try {
        const payload = JSON.stringify({
          title: senderName,
          body: messagePreview || "Nouveau message",
          icon: "/icon-192x192.png",
          badge: "/badge-72x72.png",
          tag: `msg-${conversationId}`, // Group by conversation
          data: {
            conversationId,
            url: `/chat/${conversationId}`,
          },
        });

        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        );

        sentCount++;
      } catch (error: any) {
        console.error("Push notification send error:", error);
        // If endpoint is invalid, mark for deletion
        if (error.statusCode === 410 || error.statusCode === 404) {
          failedEndpoints.push(sub.endpoint);
        }
      }
    }

    // Clean up failed subscriptions
    if (failedEndpoints.length > 0) {
      const { error: cleanupError } = await supabase
        .from(DB_TABLES.PUSH_SUBSCRIPTIONS)
        .delete()
        .in("endpoint", failedEndpoints);
      if (cleanupError) throw cleanupError;
    }

    return NextResponse.json({ sent: sentCount });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation échouée", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Push notify error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
