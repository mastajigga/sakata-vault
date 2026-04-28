import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const schema = z.object({
  postId: z.string().uuid(),
  vote: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
});

/**
 * POST /api/forum/vote
 * Body: { postId, vote: 1 | -1 | 0 }
 * 0 = remove vote
 *
 * Triggers Postgres recalculate like_count and dislike_count.
 */
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body;
  try {
    body = schema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  if (body.vote === 0) {
    const { error } = await supabase
      .from("forum_post_votes")
      .delete()
      .eq("post_id", body.postId)
      .eq("user_id", user.id);

    if (error) {
      console.error("[forum/vote] delete", error);
      return NextResponse.json({ error: "Erreur DB" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, vote: 0 });
  }

  // Upsert
  const { error } = await supabase
    .from("forum_post_votes")
    .upsert(
      { post_id: body.postId, user_id: user.id, vote: body.vote },
      { onConflict: "post_id,user_id" }
    );

  if (error) {
    console.error("[forum/vote] upsert", error);
    return NextResponse.json({ error: "Erreur DB" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, vote: body.vote });
}
