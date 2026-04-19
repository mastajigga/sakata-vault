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

  let content = article.content.fr;
  if (!content) {
    console.error("No French content found for this article.");
    return;
  }

  // Nettoyage : enlever les balises HTML et le gras Markdown qui peuvent perturber le TTS
  content = content
    .replace(/<small>[\s\S]*?<\/small>/g, "")
    .replace(/\*\*/g, "")
    .trim();

  const paragraphs = content.split("\n\n").filter(p => p.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const p of paragraphs) {
    if ((currentChunk + p).length > 3000) {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = p;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + p;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());

  console.log(`Split article into ${chunks.length} chunks.`);

  const audioBuffers: Buffer[] = [];
  const BATCH_SIZE = 1;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const end = Math.min(i + BATCH_SIZE, chunks.length);
    console.log(`Generating audio for chunks ${i + 1} to ${end}/${chunks.length}...`);
    
    const batchPromises = chunks.slice(i, end).map(async (chunk) => {
      let textToSpeak = chunk;
      if (ARTICLE_SLUG === "ngongo-philosophique") {
        const persona = "Tu es un sage Bakulutu (Ancien) de l'ethnie Sakata. Ta voix est profonde, lente, habitée par la sagesse de tes ancêtres de la Lukenie. Lis ce texte avec une grande solennité et beaucoup de mystère : ";
        textToSpeak = `${persona}\n\n${chunk}`;
      }
      return await fetchTTS(textToSpeak);
    });

    const results = await Promise.all(batchPromises);
    
    // Attendre 30 secondes entre chaque batch pour respecter les quotas
    console.log("Waiting 30 seconds before next batch...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    for (let j = 0; j < results.length; j++) {
      const audio = results[j];
      if (!audio) {
        throw new Error(`CRITICAL: Failed to generate audio for chunk ${i + j + 1}. Aborting.`);
      }
      audioBuffers.push(audio);
    }
  }

  if (audioBuffers.length === 0) {
    console.error("No audio generated.");
    return;
  }

  const mergedBuffer = mergeWavBuffers(audioBuffers);
  
  const outputPath = path.join(OUTPUT_DIR, `${ARTICLE_SLUG}.wav`);
  fs.writeFileSync(outputPath, mergedBuffer);
  console.log(`Successfully generated and merged audio: ${outputPath}`);
}

async function fetchTTS(text: string, retries = 10): Promise<Buffer | null> {
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
        console.error(`API Error (Status ${response.status}):`, JSON.stringify(data, null, 2));
        if (response.status === 429 && attempt < retries) {
          const delay = Math.pow(2, attempt) * 2000;
          console.warn(`Quota reached. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        return null;
      }

      const parts = data.candidates?.[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            return Buffer.from(part.inlineData.data, "base64");
          }
        }
      }
      
      console.warn("No audio data in response or content blocked.");
      console.warn("Finish Reason:", data.candidates?.[0].finishReason);
      
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 2000;
        console.warn(`Retrying in ${delay}ms... (Attempt ${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
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
