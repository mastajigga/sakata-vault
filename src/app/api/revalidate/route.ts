import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * ISR Cache Revalidation Endpoint
 * POST /api/revalidate
 *
 * Headers:
 *   x-revalidate-secret: <REVALIDATE_SECRET env var>
 *
 * Body (JSON):
 *   { tag?: string }   — revalidate by cache tag
 *   { path?: string }  — revalidate by path (falls back to "/" if absent)
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { tag, path } = body as { tag?: string; path?: string };

  if (!tag && !path) {
    return NextResponse.json({ error: "Missing tag or path" }, { status: 400 });
  }

  if (tag) {
    revalidateTag(tag, {});
  }
  if (path) {
    revalidatePath(path, "page");
  }

  return NextResponse.json({ revalidated: true, tag, path }, { status: 200 });
}
