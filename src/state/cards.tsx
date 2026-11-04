import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ListSkeleton } from "../components/Skeleton";
import { WordEntry } from "../data/cards";
import { loadCards } from "../db/database";

const CardsContext = createContext<WordEntry[] | null>(null);

// Lädt die Karten einmal aus der Datenbank und stellt sie allen Seiten zur Verfügung.
export function CardsProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<WordEntry[] | null>(null);

  useEffect(() => {
    loadCards().then(setCards);
  }, []);

  if (!cards) return <ListSkeleton />;

  return <CardsContext.Provider value={cards}>{children}</CardsContext.Provider>;
}

export function useCards() {
  const cards = useContext(CardsContext);
  if (!cards) throw new Error("useCards muss innerhalb von CardsProvider genutzt werden");
  return cards;
}
