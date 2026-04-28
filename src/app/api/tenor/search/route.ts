import { NextResponse } from "next/server";

/**
 * Proxy GET /api/tenor/search to keep the API key server-side.
 * Query params:
 *  - q: search term (optional, defaults to trending)
 *  - trending=1: force trending feed
 *  - limit: results count (default 24, max 50)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("q") || "").trim();
  const trending = searchParams.get("trending") === "1" || query.length === 0;
  const limit = Math.min(parseInt(searchParams.get("limit") || "24", 10), 50);

  const apiKey = process.env.TENOR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Tenor API key not configured" },
      { status: 503 }
    );
  }

  const endpoint = trending
    ? "https://tenor.googleapis.com/v2/featured"
    : "https://tenor.googleapis.com/v2/search";

  const params = new URLSearchParams({
    key: apiKey,
    client_key: "sakata-mboka",
    limit: String(limit),
    media_filter: "tinygif,gif",
    contentfilter: "medium", // exclude NSFW
    locale: "fr_FR",
  });

  if (!trending) params.set("q", query);

  try {
    const res = await fetch(`${endpoint}?${params.toString()}`, {
      next: { revalidate: 3600 }, // 1h CDN cache
    });

    if (!res.ok) {
      console.error("[Tenor] Bad response", res.status);
      return NextResponse.json(
        { error: "Tenor API error", status: res.status },
        { status: 502 }
      );
    }

    const data = await res.json();
    const results = (data.results || []).map((item: any) => {
      const tinygif = item.media_formats?.tinygif;
      const gif = item.media_formats?.gif;
      return {
        id: item.id,
        title: item.content_description || item.title || "GIF",
        url: item.url,
        preview: tinygif?.url || gif?.url,
        full: gif?.url,
        width: gif?.dims?.[0] || 480,
        height: gif?.dims?.[1] || 360,
      };
    });

    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("[Tenor] Fetch failed", err);
    return NextResponse.json(
      { error: "Network error fetching Tenor" },
      { status: 502 }
    );
  }
}
