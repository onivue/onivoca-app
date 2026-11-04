import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ListSkeleton } from "../components/Skeleton";
import { ProgressMap, Rating, review } from "../lib/srs";

const STORAGE_KEY = "progress-v2";

type ProgressContextValue = {
  progress: ProgressMap;
  rate: (cardId: string, rating: Rating) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

// Frühere IDs trugen das Präfix "fav-"; der gespeicherte Lernstand wird darauf umgeschrieben.
function migrateIds(stored: ProgressMap): ProgressMap {
  return Object.fromEntries(Object.entries(stored).map(([id, value]) => [id.replace(/^fav-/, ""), value]));
}

// Hält den Lernstand aller Karten und speichert ihn auf dem Gerät.
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => setProgress(raw ? migrateIds(JSON.parse(raw)) : {}));
  }, []);

  // Solange der gespeicherte Stand lädt, zeigen wir ein Skeleton.
  if (!progress) return <ListSkeleton />;

  // Optimistisch: die UI übernimmt sofort, bei Speicherfehler geht es zurück zum alten Stand.
  function save(next: ProgressMap) {
    const previous = progress!;
    setProgress(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => setProgress(previous));
  }

  function rate(cardId: string, rating: Rating) {
    save({ ...progress!, [cardId]: review(progress![cardId], rating) });
  }

  return (
    <ProgressContext.Provider value={{ progress, rate, reset: () => save({}) }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress muss innerhalb von ProgressProvider genutzt werden");
  return value;
}
