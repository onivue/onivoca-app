import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ListSkeleton } from "../components/Skeleton";
import { ProgressMap, Rating, RoundDelays, SESSION_SIZE, review } from "../lib/srs";

const STORAGE_KEY = "progress-v2";
const SETTINGS_KEY = "study-settings-v1";
const DEFAULT_DELAYS: RoundDelays = { again: 1, good: 3 };
type StudySettings = { round: number; delays: RoundDelays; sessionSize: number };

type ProgressContextValue = {
  progress: ProgressMap;
  round: number;
  delays: RoundDelays;
  sessionSize: number;
  setSessionSize: (size: number) => void;
  rate: (cardId: string, rating: Rating) => void;
  advanceRound: () => void;
  setDelay: (rating: keyof RoundDelays, rounds: number) => void;
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
  const [settings, setSettings] = useState<StudySettings | null>(null);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(STORAGE_KEY), AsyncStorage.getItem(SETTINGS_KEY)]).then(
      ([progressRaw, settingsRaw]) => {
        setProgress(progressRaw ? migrateIds(JSON.parse(progressRaw)) : {});
        const storedSettings = settingsRaw ? JSON.parse(settingsRaw) : null;
        setSettings(
          storedSettings
            ? { sessionSize: SESSION_SIZE, ...storedSettings, delays: { ...DEFAULT_DELAYS, ...storedSettings.delays } }
            : { round: 0, delays: DEFAULT_DELAYS, sessionSize: SESSION_SIZE },
        );
      },
    );
  }, []);

  // Solange der gespeicherte Stand lädt, zeigen wir ein Skeleton.
  if (!progress || !settings) return <ListSkeleton />;

  // Optimistisch: die UI übernimmt sofort, bei Speicherfehler geht es zurück zum alten Stand.
  function save(next: ProgressMap) {
    const previous = progress!;
    setProgress(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => setProgress(previous));
  }

  function rate(cardId: string, rating: Rating) {
    save({ ...progress!, [cardId]: review(progress![cardId], rating, settings!.round, settings!.delays) });
  }

  function updateSettings(next: StudySettings) {
    setSettings(next);
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }

  function advanceRound() {
    updateSettings({ ...settings!, round: settings!.round + 1 });
  }

  function setDelay(rating: keyof RoundDelays, rounds: number) {
    updateSettings({ ...settings!, delays: { ...settings!.delays, [rating]: rounds } });
  }

  function setSessionSize(size: number) {
    updateSettings({ ...settings!, sessionSize: size });
  }

  function reset() {
    save({});
    updateSettings({ ...settings!, round: 0 });
  }

  return (
    <ProgressContext.Provider value={{ progress, round: settings.round, delays: settings.delays, sessionSize: settings.sessionSize, setSessionSize, rate, advanceRound, setDelay, reset }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress muss innerhalb von ProgressProvider genutzt werden");
  return value;
}
