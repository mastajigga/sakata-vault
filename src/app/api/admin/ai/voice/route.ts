import { getCurrentAuthUser } from "@/lib/api/auth-helpers";
import { GoogleGenerativeAI, type GenerationConfig } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { aiVoiceSchema } from "@/lib/schemas/validation";
import { z } from "zod";

export const dynamic = 'force-dynamic';

async function authGuard() {
  const { user, supabase } = await getCurrentAuthUser({ withClient: true, writeCookies: true });
  if (!user) return { authorized: false };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile lookup failed:", profileError);
    return { authorized: false, user };
  }

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
    const body = await req.json();

    let text: string, voice: string;
    try {
      ({ text, voice } = aiVoiceSchema.parse(body));
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const flattened = validationError.flatten();
        return NextResponse.json(
          { error: "Validation failed", fieldErrors: flattened.fieldErrors },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // The installed SDK forwards these TTS fields but does not declare them yet.
    const generationConfig: GenerationConfig & {
      responseModalities: string[];
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: string } } };
    } = {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
      },
    };
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-tts",
      generationConfig,
    });

    const result = await model.generateContent([
      { text: `Générez une narration vocale pour ce texte avec un ton de vieux sage africain, profond et chaleureux : \n\n${text}` }
    ]);

    const audioData = result.response.candidates?.[0]?.content?.parts
      ?.find((part) => part.inlineData?.mimeType?.startsWith("audio/"))?.inlineData;

    if (!audioData?.data) {
      // Fallback if audio generation failed or not supported in this env
      return NextResponse.json({ error: "Audio generation failed or not supported by this model." }, { status: 500 });
    }

    return NextResponse.json({ 
      audioUrl: `data:${audioData.mimeType};base64,${audioData.data}` 
    });

  } catch (err: any) {
    console.error("AI Voice Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
