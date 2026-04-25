import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { DB_TABLES } from "@/lib/constants/db";
import { contributionRequestSchema } from "@/lib/schemas/validation";

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

    const body = await request.json();
    const validated = contributionRequestSchema.parse(body);
    const { requestType, message } = validated;

    // Check if user already has a pending request of this type
    const { data: existingRequest } = await supabase
      .from(DB_TABLES.CONTRIBUTION_REQUESTS)
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
      .from(DB_TABLES.CONTRIBUTION_REQUESTS)
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
          "Votre demande a été envoyée. L'équipe Sakata examinera votre profil et vous contactera.",
        request: data,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      );
    }
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
      .from(DB_TABLES.CONTRIBUTION_REQUESTS)
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
