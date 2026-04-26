import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidateSchema } from "@/lib/schemas/validation";

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
  try {
    const secret = request.headers.get("x-revalidate-secret");
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch((err) => {
      console.error("[Revalidate] JSON parse failed:", {
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      });
      return {};
    });

    const validated = revalidateSchema.parse(body);

    if (validated.tag) {
      revalidateTag(validated.tag, {});
    }
    if (validated.path) {
      revalidatePath(validated.path, "page");
    }

    return NextResponse.json({ revalidated: true, tag: validated.tag, path: validated.path }, { status: 200 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      );
    }
    console.error("[Revalidate] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
