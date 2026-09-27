import { GoogleFontsProvider } from "./GoogleFontsProvider";
import type { FontProvider } from "./FontProvider";
import type { RemoteFont, FontDiscoveryIntent, FontSearchQuery } from "../../types/fonts";

const defaultProvider: FontProvider = new GoogleFontsProvider();

export function parseAIQueryIntent(prompt: string): FontDiscoveryIntent {
  const normalized = prompt.toLowerCase();
  const intent: FontDiscoveryIntent = {
    query: prompt,
    language: [],
    script: [],
    styles: [],
    categories: []
  };

  // Detect script/language
  if (normalized.includes("urdu")) {
    intent.language.push("Urdu");
    intent.script.push("Urdu");
  }
  if (normalized.includes("arabic")) {
    intent.language.push("Arabic");
    intent.script.push("Arabic");
  }
  if (normalized.includes("persian") || normalized.includes("farsi")) {
    intent.language.push("Persian");
    intent.script.push("Persian");
  }

  // Detect typography styles
  if (normalized.includes("nastaliq") || normalized.includes("nastaleeq") || normalized.includes("banner") || normalized.includes("pakistani")) {
    intent.styles.push("Nastaliq");
    intent.categories.push("Nastaliq");
  }
  if (normalized.includes("naskh") || normalized.includes("book") || normalized.includes("article") || normalized.includes("newspaper")) {
    intent.styles.push("Naskh");
    intent.categories.push("Naskh");
  }
  if (normalized.includes("ruqaa") || normalized.includes("calligraphy") || normalized.includes("wedding") || normalized.includes("invitation")) {
    intent.styles.push("Ruqaa");
    intent.categories.push("Ruqaa");
  }
  if (normalized.includes("kufi") || normalized.includes("modern") || normalized.includes("geometric")) {
    intent.styles.push("Kufi");
    intent.categories.push("Kufi");
  }
  if (normalized.includes("bold") || normalized.includes("poster") || normalized.includes("advertising") || normalized.includes("sale") || normalized.includes("headline")) {
    intent.styles.push("Display");
    intent.categories.push("Display");
  }

  return intent;
}

export async function searchRemoteFonts(
  promptOrQuery: string | FontSearchQuery,
  provider: FontProvider = defaultProvider
): Promise<{ intent?: FontDiscoveryIntent; results: RemoteFont[] }> {
  let searchQuery: FontSearchQuery;
  let intent: FontDiscoveryIntent | undefined;

  if (typeof promptOrQuery === "string") {
    intent = parseAIQueryIntent(promptOrQuery);
    searchQuery = {
      query: promptOrQuery,
      script: intent.script.length > 0 ? intent.script : undefined,
      category: intent.categories.length > 0 ? intent.categories : undefined
    };
  } else {
    searchQuery = promptOrQuery;
  }

  const results = await provider.search(searchQuery);

  // If intent was specific, sort results that match intent styles first
  if (intent && intent.styles.length > 0) {
    results.sort((a, b) => {
      const aMatch = intent!.styles.some(s => a.category.toLowerCase().includes(s.toLowerCase()));
      const bMatch = intent!.styles.some(s => b.category.toLowerCase().includes(s.toLowerCase()));
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }

  return { intent, results };
}

export async function downloadAndGetBuffer(
  font: RemoteFont,
  onProgress?: (percent: number) => void,
  provider: FontProvider = defaultProvider
): Promise<ArrayBuffer> {
  return provider.downloadFont(font, onProgress);
}
