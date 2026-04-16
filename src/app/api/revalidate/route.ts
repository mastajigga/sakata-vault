import { NextRequest, NextResponse } from "next/server";

/**
 * ISR Cache Revalidation Endpoint
 * POST /api/revalidate
 * Note: Caching is handled via Cache-Control headers in API routes.
 * This endpoint acknowledges revalidation requests.
 */
export async function POST(request: NextRequest) {
  const { tag } = await request.json();

  if (!tag) {
    return NextResponse.json({ error: "Missing tag" }, { status: 400 });
  }

  return NextResponse.json(
    { revalidated: true, tag },
    { status: 200 }
  );
}
