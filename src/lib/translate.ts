/**
 * Sakata Translation Service
 * Implements automatic translation across the 5 supported languages.
 */

export type LanguageCode = "fr" | "skt" | "lin" | "swa" | "tsh";

export async function translateText(text: string, targetLang: LanguageCode): Promise<string> {
  // In a real production environment, this would call Google Cloud Translate, DeepL, or a Custom LLM.
  // For this demonstration, we'll simulate the latency and provide a placeholder with language markers.
  
  console.log(`Translating to ${targetLang}: ${text.substring(0, 20)}...`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (targetLang === "fr") return text;

  // Mock translation patterns for demo purposes
  const mockPrefixes: Record<string, string> = {
    skt: "[Skt] ",
    lin: "[Lin] ",
    swa: "[Swa] ",
    tsh: "[Tsh] "
  };

  // If we have a very simple text, we can do basic dictionary matches for the demo
  const simpleDict: Record<string, Record<string, string>> = {
    "Histoire": { skt: "Nsoni", lin: "Lisolo", swa: "Historia", tsh: "Malu" },
    "Culture": { skt: "Mimeso", lin: "Bokoko", swa: "Utamaduni", tsh: "Tshifuifu" },
  };

  if (simpleDict[text] && simpleDict[text][targetLang]) {
    return simpleDict[text][targetLang];
  }

  return `${mockPrefixes[targetLang] || ""}${text}`;
}

export async function translateArticle(articleData: any, targetLangs: LanguageCode[]): Promise<any> {
    const newData = { ...articleData };
    
    // Ensure nested objects exist
    newData.title = newData.title || {};
    newData.content = newData.content || {};
    newData.summary = newData.summary || {};

    const sourceLang = "fr"; // Default source
    const sourceTitle = newData.title[sourceLang];
    const sourceContent = newData.content[sourceLang];
    const sourceSummary = newData.summary[sourceLang];

    for (const lang of targetLangs) {
        if (lang === sourceLang) continue;

        if (sourceTitle && !newData.title[lang]) {
            newData.title[lang] = await translateText(sourceTitle, lang);
        }
        if (sourceContent && !newData.content[lang]) {
            newData.content[lang] = await translateText(sourceContent, lang);
        }
        if (sourceSummary && !newData.summary[lang]) {
            newData.summary[lang] = await translateText(sourceSummary, lang);
        }
    }

    return newData;
}
