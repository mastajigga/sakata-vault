import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { aiChatSchema } from "@/lib/schemas/validation";
import { z } from "zod";

export const dynamic = 'force-dynamic';

async function authGuard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return { authorized: false, user: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin" || profile?.role === "manager";
  return { authorized: isAdmin, user };
}

export async function POST(req: Request) {
  try {
    const { authorized } = await authGuard();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });
    const index = pc.Index(process.env.PINECONE_INDEX || "sakata");

    const body = await req.json();

    try {
      var { message, history = [] } = aiChatSchema.parse(body);
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

    // 1. Generate embedding for the query
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embedResult = await embedModel.embedContent(message);
    const embedding = embedResult.embedding.values;

    // 2. Search Pinecone
    // We search across common namespaces
    const namespaces = ["iluo_livres_academiques", "iluo_livres_site", "iluo_exercices"];
    let allMatches: any[] = [];

    for (const ns of namespaces) {
      const queryResponse = await index.namespace(ns).query({
        vector: embedding,
        topK: 3,
        includeMetadata: true,
      });
      allMatches = [...allMatches, ...queryResponse.matches.map(m => ({ ...m, namespace: ns }))];
    }

    // Sort by score and take top 5
    allMatches.sort((a, b) => b.score - a.score);
    const topMatches = allMatches.slice(0, 5);

    // 3. Build context
    const contextLines = topMatches.map(match => {
      const metadata = match.metadata as any;
      return `[Source: ${metadata.title || "Document"} (Namespace: ${match.namespace})]\n${metadata.text || ""}`;
    });

    const context = contextLines.join("\n\n---\n\n");

    // 4. Generate response with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const systemPrompt = `Vous êtes le Vieux Sage du Hub Digital Sakata. 
Votre rôle est d'aider les administrateurs à explorer la base de connaissances Sakata (mémoire Pinecone).
Utilisez les extraits fournis pour répondre de manière précise et profonde.
Si l'information n'est pas dans le contexte, dites-le humblement comme un sage, tout en proposant des pistes de réflexion basées sur votre sagesse ancestrale.
Répondez de manière structurée et élégante.`;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Bonjour Vieux Sage. Êtes-vous prêt à m'aider ?" }] },
        { role: "model", parts: [{ text: "Bonjour, gardien du savoir. Je suis prêt à explorer les méandres de notre mémoire collective avec vous. Que cherchez-vous dans le sanctuaire des Sakata ?" }] },
        ...history
      ],
    });

    const prompt = `Contexte de recherche :\n${context}\n\nQuestion de l'administrateur : ${message}\n\nRépondez en vous basant sur le contexte ci-dessus.`;
    
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ 
      answer: responseText,
      sources: topMatches.map(m => ({
        id: m.id,
        title: (m.metadata as any).title || "Inconnue",
        namespace: m.namespace,
        score: m.score
      }))
    });

  } catch (err: any) {
    console.error("AI Chat Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
