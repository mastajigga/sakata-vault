import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
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
