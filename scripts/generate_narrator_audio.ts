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

async function fetchTTS(text: string, retries = 3): Promise<Buffer | null> {
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

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: any = await response.json();
      if (!response.ok) {
        if (response.status === 429 && attempt < retries) {
          const delay = Math.pow(2, attempt) * 2000;
          console.warn(`Quota reached. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
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
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 2000;
        console.warn(`Fetch error. Retrying in ${delay}ms...:`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      console.error("Error in fetchTTS:", error);
      return null;
    }
  }
  return null;
}

function mergeWavBuffers(buffers: Buffer[]): Buffer {
  if (buffers.length === 1) return buffers[0];

  // Standard WAV header size
  const headerSize = 44;
  
  // Collect all audio data (stripping headers from all segments)
  const dataSegments: Buffer[] = buffers.map(buf => buf.subarray(headerSize));
  const audioData = Buffer.concat(dataSegments);
  
  // Create a clean header
  const header = Buffer.alloc(headerSize);
  const totalLength = headerSize + audioData.length;
  
  // 0-3: RIFF
  header.write("RIFF", 0);
  // 4-7: File length - 8
  header.writeUInt32LE(totalLength - 8, 4);
  // 8-11: WAVE
  header.write("WAVE", 8);
  // 12-15: fmt 
  header.write("fmt ", 12);
  // 16-19: Chunk size (16 for PCM)
  header.writeUInt32LE(16, 16);
  // 20-21: Format (1 for PCM)
  header.writeUInt16LE(1, 20);
  // 22-23: Channels (1 for Mono)
  header.writeUInt16LE(1, 22);
  // 24-27: Sample Rate (Using 24000Hz as default for Charon voice)
  header.writeUInt32LE(24000, 24);
  // 28-31: Byte Rate (SampleRate * Channels * BitsPerSample / 8)
  header.writeUInt32LE(48000, 28);
  // 32-33: Block Align (Channels * BitsPerSample / 8)
  header.writeUInt16LE(2, 32);
  // 34-35: Bits per sample (16)
  header.writeUInt16LE(16, 34);
  // 36-39: data
  header.write("data", 36);
  // 40-43: Data size
  header.writeUInt32LE(audioData.length, 40);

  return Buffer.concat([header, audioData]);
}

generateAudioForArticle();
