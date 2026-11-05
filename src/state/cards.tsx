import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { ListSkeleton } from "../components/Skeleton";
import { WordEntry, isPhraseEntry } from "../data/cards";
import { loadCards } from "../db/database";
import { useLanguage } from "./language";

type CardsValue = { words: WordEntry[]; sentences: WordEntry[] };
const CardsContext = createContext<CardsValue | null>(null);

// Lädt die Karten einmal aus der Datenbank und stellt die Karten der gewählten Lernsprache bereit,
// getrennt in Wörter und Sätze (Wendungen, Redewendungen, ganze Sätze).
export function CardsProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<WordEntry[] | null>(null);

  useEffect(() => {
    loadCards().then(setCards);
  }, []);

  const { lang } = useLanguage();
  const value = useMemo<CardsValue | null>(() => {
    if (!cards) return null;
    const forLang = cards.filter((c) => (c.lang ?? "en") === lang);
    return {
      words: forLang.filter((c) => !isPhraseEntry(c)),
      sentences: forLang.filter(isPhraseEntry),
    };
  }, [cards, lang]);

  if (!value) return <ListSkeleton />;

  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>;
}

function useCardsValue() {
  const value = useContext(CardsContext);
  if (!value) throw new Error("useCards muss innerhalb von CardsProvider genutzt werden");
  return value;
}

// Wörter der gewählten Sprache.
export function useCards() {
  return useCardsValue().words;
}

// Sätze der gewählten Sprache (Wendungen und ganze Sätze), leer wenn es keine gibt.
export function useSentences() {
  return useCardsValue().sentences;
}
