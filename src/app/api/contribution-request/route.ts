import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { requestType = "article_writer", message = "" } = await request.json();

    if (!["article_writer", "contributor"].includes(requestType)) {
      return NextResponse.json(
        { error: "Type de demande invalide" },
        { status: 400 }
      );
    }

    // Check if user already has a pending request of this type
    const { data: existingRequest } = await supabase
      .from("contribution_requests")
      .select("*")
      .eq("user_id", user.id)
      .eq("request_type", requestType)
      .eq("status", "pending")
      .single();

    if (existingRequest) {
      return NextResponse.json(
        {
          error:
            "Vous avez déjà une demande en attente pour ce rôle. Veuillez attendre la réponse de l'équipe.",
        },
        { status: 409 }
      );
    }

    // Create the request
    const { data, error } = await supabase
      .from("contribution_requests")
      .insert({
        user_id: user.id,
        request_type: requestType,
        message: message || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating contribution request:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création de la demande" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Votre demande a été envoyée. L'équipe Kisakata examinera votre profil et vous contactera.",
        request: data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/contribution-request:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Get user's own requests
    const { data, error } = await supabase
      .from("contribution_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des demandes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ requests: data });
  } catch (err) {
    console.error("GET /api/contribution-request:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
