import { getCurrentAuthUser } from "@/lib/api/auth-helpers";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  postId: z.string().uuid(),
  category: z.enum(["off_topic", "insult_hate", "spam", "misinformation", "other"]),
  description: z.string().max(2000).optional().nullable(),
});

export async function POST(req: Request) {
  const { user, supabase } = await getCurrentAuthUser({ withClient: true });
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body;
  try {
    body = schema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const { error } = await supabase.from("moderation_reports").insert({
    reporter_id: user.id,
    target_post_id: body.postId,
    category: body.category,
    description: body.description ?? null,
  });

  if (error) {
    console.error("[forum/report]", error);
    return NextResponse.json({ error: "Erreur DB" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
