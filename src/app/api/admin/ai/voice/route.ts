import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

async function authGuard() {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { authorized: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin" || profile?.role === "manager";
  return { authorized: isAdmin };
}

export async function POST(req: Request) {
  const auth = await authGuard();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    const { text, voice = "Puck" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Use a model that supports audio output
    // Note: This feature might be in preview or require specific model names like gemini-1.5-pro-002
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-002",
      generationConfig: {
        //@ts-ignore - responseModalities is a new feature
        responseModalities: ["audio"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice // e.g., "Puck", "Charon", "Kore", "Fenrir"
            }
          }
        }
      } as any
    });

    const result = await model.generateContent([
      { text: `Générez une narration vocale pour ce texte avec un ton de vieux sage africain, profond et chaleureux : \n\n${text}` }
    ]);

    const response = await result.response;
    // @ts-ignore - audio is a new property
    const audioData = response.audio;

    if (!audioData) {
      // Fallback if audio generation failed or not supported in this env
      return NextResponse.json({ error: "Audio generation failed or not supported by this model." }, { status: 500 });
    }

    // the audio data is usually a base64 string or buffer
    return NextResponse.json({ 
      audioUrl: `data:audio/wav;base64,${audioData.data}` 
    });

  } catch (err: any) {
    console.error("AI Voice Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
