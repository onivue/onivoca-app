// Typen und Themen der Karteikarten. Die Stammdaten liegen in src/data/words/data.json, zur Laufzeit in SQLite (src/db).

export type TopicId = "daily" | "emotion" | "law" | "society" | "body" | "nature" | "work";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Lang = "en" | "es";
export type Register = "neutral" | "formal" | "informal" | "literary" | "archaic" | "slang" | "vulgar";
export type Pos = "noun" | "verb" | "adj" | "adv" | "phrasal-verb" | "idiom" | "phrase" | "sentence";
export type RelationType = "synonym" | "antonym" | "confusable" | "family" | "collocate" | "related";

// Feldnamen mit "en"/"definitionEn" gelten für die Zielsprache (Englisch oder Spanisch), "de" ist immer Deutsch.
export type Example = {
  en: string; // Satz in der Zielsprache
  de: string;
  hit?: string; // Wortform des Lemmas im Satz der Zielsprache
};

export type Relation = {
  type: RelationType;
  word: string;
  ref?: string; // ID der Karte, falls das Wort im Deck existiert
  noteDe?: string;
};

export type Usage = {
  collocations?: string[];
  grammar?: string;
  tip?: string;
};

// Eine Karte = ein Sinn eines Lemmas. Favoriten-Importe haben noch keine Beispiele und kein Level.
export type WordEntry = {
  id: string; // Spanische IDs beginnen mit "es-"
  lang?: Lang; // fehlt = "en"
  focus?: string; // nur Satzkarten: das Wort, um das es im Satz geht
  lemma: string;
  pos?: Pos;
  ipa?: string;
  level?: Level;
  register?: Register;
  de: string;
  deAlt?: string[];
  definitionEn?: string;
  examples: Example[];
  usage?: Usage;
  mnemonic?: string;
  relations: Relation[];
  topics: TopicId[];
  clusters: string[];
  source: "favorite" | "generated";
};

// Jedes Thema hat ein Label, eine Pastellfarbe (Flächen) und eine kräftige Farbe (Text, Icons).
export const TOPICS: Record<TopicId, { label: string; color: string; accent: string }> = {
  daily: { label: "Alltag", color: "#D5DAFE", accent: "#6366F1" },
  emotion: { label: "Gefühle", color: "#F9D3EA", accent: "#C026D3" },
  law: { label: "Recht", color: "#FFDCC2", accent: "#EA580C" },
  society: { label: "Gesellschaft", color: "#BFE9FB", accent: "#0284C7" },
  body: { label: "Körper", color: "#FDE2E2", accent: "#DC2626" },
  nature: { label: "Natur", color: "#C9F4D4", accent: "#16A34A" },
  work: { label: "Arbeit & Geld", color: "#FFF0B8", accent: "#B45309" },
};

export const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Sprachen, die man lernen kann. speech = Sprachcode für die Vorlesefunktion.
export const LANGUAGES: Record<Lang, { label: string; speech: string; sort: string }> = {
  en: { label: "Englisch", speech: "en-US", sort: "en" },
  es: { label: "Spanisch", speech: "es-ES", sort: "es" },
};
export const LANG_ORDER: Lang[] = ["en", "es"];

export const REGISTER_LABELS: Record<Register, string> = {
  neutral: "neutral",
  formal: "formell",
  informal: "umgangssprachlich",
  literary: "literarisch",
  archaic: "veraltet",
  slang: "Slang",
  vulgar: "vulgär",
};

export const POS_LABELS: Record<Pos, string> = {
  noun: "Nomen",
  verb: "Verb",
  adj: "Adjektiv",
  adv: "Adverb",
  "phrasal-verb": "Phrasal Verb",
  idiom: "Redewendung",
  phrase: "Wendung",
  sentence: "Satz",
};

export const RELATION_LABELS: Record<RelationType, string> = {
  synonym: "Synonyme",
  antonym: "Gegenteile",
  confusable: "Verwechslungsgefahr",
  family: "Wortfamilie",
  collocate: "Passt oft dazu",
  related: "Verwandt",
};

// Reihenfolge der Gruppen im Wortnetz.
export const RELATION_ORDER: RelationType[] = ["synonym", "antonym", "confusable", "family", "collocate", "related"];

export const CLUSTER_LABELS: Record<string, string> = {
  "court-and-justice": "Gericht & Justiz",
  "seven-sins": "Sieben Todsünden",
  "ough-words": "Verwechselbare -ough-Wörter",
  "doom-family": "Untergang & Verhängnis",
  "false-friends": "Falsche Freunde",
  "travel-and-transport": "Reisen & Verkehr",
  "home-and-household": "Zuhause & Haushalt",
  "feelings-and-character": "Gefühle & Charakter",
  "work-and-money": "Job & Geld",
  "health-and-body": "Gesundheit",
  "weather-and-environment": "Wetter & Umwelt",
  "everyday-verbs": "Alltagsverben",
  "linking-words": "Satzverbinder",
  // Spanisch
  time: "Zeit & Kalender",
  "life-and-death": "Leben & Tod",
  "place-and-community": "Orte & Gemeinschaft",
  "family-and-people": "Familie & Menschen",
  communication: "Sprechen & Kommunikation",
  "body-parts": "Körperteile",
  "law-and-order": "Recht & Ordnung",
  "food-and-drink": "Essen & Trinken",
  "business-and-work": "Firma & Beruf",
};

// "Sätze" sind alle Karten, die länger als ein Wort sind: Wendungen, Redewendungen und ganze Sätze.
export function isPhraseEntry(card: WordEntry) {
  return card.pos === "phrase" || card.pos === "idiom" || card.pos === "sentence";
}
