// Typen und Kategorien der Karteikarten. Die Karten selbst liegen in der SQLite-Datenbank (src/db).

export type CategoryId = "alltag" | "essen" | "reisen" | "gefuehle" | "phrasen";

export type Example = { en: string; de: string };

export type CardData = {
  id: string;
  front: string; // Englisch: Wort oder Satz
  back: string; // Deutsche Übersetzung
  category: CategoryId;
  phonetic: string; // Aussprache (IPA)
  examples: Example[];
  note?: string; // Erklärung oder Merkhilfe
};

// Jede Kategorie hat ein Label, eine Pastellfarbe (Flächen) und eine kräftige Farbe (Text, Icons).
export const CATEGORIES: Record<
  CategoryId,
  { label: string; color: string; accent: string }
> = {
  alltag: { label: "Alltag", color: "#D5DAFE", accent: "#6366F1" },
  essen: { label: "Essen", color: "#FFDCC2", accent: "#EA580C" },
  reisen: { label: "Reisen", color: "#BFE9FB", accent: "#0284C7" },
  gefuehle: { label: "Gefühle", color: "#F9D3EA", accent: "#C026D3" },
  phrasen: { label: "Sätze", color: "#C9F4D4", accent: "#16A34A" },
};
