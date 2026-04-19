import * as fs from "fs";
import * as path from "path";
import { ARTICLES } from "../src/data/articles";

const ARTICLE_SLUG = process.argv[2] || "chefferie-equilibre-deux-mondes";
const OUTPUT_DIR = path.join(process.cwd(), "public", "audio", "articles");
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3.1-flash-tts-preview";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateAudioForArticle() {
  const article = ARTICLES.find((a) => a.slug === ARTICLE_SLUG);
  if (!article) {
    console.error(`Article with slug ${ARTICLE_SLUG} not found.`);
    return;
  }

  const content = article.content.fr;
  if (!content) {
    console.error("No French content found for this article.");
    return;
  }

  // Split content into chunks (paragraphs/sections)
  // Max chunk size for TTS should be reasonable (e.g. 1000-2000 chars)
  const paragraphs = content.split("\n\n").filter(p => p.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const p of paragraphs) {
    if ((currentChunk + p).length > 1500) {
      chunks.push(currentChunk);
      currentChunk = p;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + p;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  console.log(`Split article into ${chunks.length} chunks.`);

  const audioBuffers: Buffer[] = [];

  for (let i = 0; i < chunks.length; i++) {
    console.log(`Generating audio for chunk ${i + 1}/${chunks.length}...`);
    const audio = await fetchTTS(chunks[i]);
    if (audio) {
      audioBuffers.push(audio);
    } else {
      console.error(`Failed to generate audio for chunk ${i + 1}`);
    }
  }

  if (audioBuffers.length === 0) {
    console.error("No audio generated.");
    return;
  }

  // Merge audio segments
  // For WAV, we need to handle headers. 
  // Simplified version: Concat the first WAV fully, then concat the others stripping the 44-byte header.
  // Then fix the total length in the first header.
  const mergedBuffer = mergeWavBuffers(audioBuffers);
  
  const outputPath = path.join(OUTPUT_DIR, `${ARTICLE_SLUG}.wav`);
  fs.writeFileSync(outputPath, mergedBuffer);
  console.log(`Successfully generated and merged audio: ${outputPath}`);
}

async function fetchTTS(text: string): Promise<Buffer | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const payload = {
    contents: [{ role: "user", parts: [{ text }] }],
    generationConfig: {
      response_modalities: ["AUDIO"],
      speech_config: {
        voice_config: {
          prebuilt_voice_config: {
            voice_name: "Charon",
          },
        },
      },
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: any = await response.json();
    if (!response.ok) {
      console.error("API Error:", JSON.stringify(data, null, 2));
      return null;
    }

    const parts = data.candidates?.[0].content.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return Buffer.from(part.inlineData.data, "base64");
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error in fetchTTS:", error);
    return null;
  }
}

function mergeWavBuffers(buffers: Buffer[]): Buffer {
  if (buffers.length === 1) return buffers[0];

  // WAV header is usually 44 bytes
  const headerSize = 44;
  const firstBuffer = buffers[0];
  const audioData: Buffer[] = [firstBuffer];

  for (let i = 1; i < buffers.length; i++) {
    // Strip header from subsequent buffers
    audioData.push(buffers[i].subarray(headerSize));
  }

  const finalBuffer = Buffer.concat(audioData);

  // Update WAV header with new length
  // Total size (file size - 8 bytes) at offset 4
  // Data size (total bytes - 44 bytes) at offset 40
  const totalSize = finalBuffer.length - 8;
  const dataSize = finalBuffer.length - 44;

  finalBuffer.writeUInt32LE(totalSize, 4);
  finalBuffer.writeUInt32LE(dataSize, 40);

  return finalBuffer;
}

generateAudioForArticle();
