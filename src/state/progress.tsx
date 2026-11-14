import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ListSkeleton } from "../components/Skeleton";
import { DEFAULT_MIX, DifficultyMix } from "../lib/difficulty";
import { CardProgress, ProgressMap, Rating, RoundDelays, SESSION_SIZE, review } from "../lib/srs";

const STORAGE_KEY = "progress-v2";
const SETTINGS_KEY = "study-settings-v1";
const DISABLED_KEY = "disabled-cards-v1";
const DEFAULT_DELAYS: RoundDelays = { again: 1, good: 3 };
// seed: 0 = neue Karten in fester Reihenfolge, sonst zufällig gemischt.
type StudySettings = { round: number; delays: RoundDelays; sessionSize: number; mix: DifficultyMix; seed: number };

type ProgressContextValue = {
  progress: ProgressMap;
  round: number;
  delays: RoundDelays;
  sessionSize: number;
  mix: DifficultyMix;
  seed: number;
  disabled: ReadonlySet<string>; // Karten, die nicht mehr in Runden vorkommen
  setSessionSize: (size: number) => void;
  setMix: (mix: DifficultyMix) => void;
  rate: (cardId: string, rating: Rating) => CardProgress; // liefert den neuen Stand der Karte
  advanceRound: () => void;
  setDelay: (rating: keyof RoundDelays, rounds: number) => void;
  setCardDisabled: (cardId: string, disabled: boolean) => void;
  reshuffle: () => void;
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
  const [disabled, setDisabled] = useState<ReadonlySet<string> | null>(null);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(SETTINGS_KEY),
      AsyncStorage.getItem(DISABLED_KEY),
    ]).then(([progressRaw, settingsRaw, disabledRaw]) => {
      setProgress(progressRaw ? migrateIds(JSON.parse(progressRaw)) : {});
      setDisabled(new Set<string>(disabledRaw ? JSON.parse(disabledRaw) : []));
      const storedSettings = settingsRaw ? JSON.parse(settingsRaw) : null;
      setSettings(
        storedSettings
          ? {
              sessionSize: SESSION_SIZE,
              seed: 0,
              ...storedSettings,
              delays: { ...DEFAULT_DELAYS, ...storedSettings.delays },
              mix: {
                ...DEFAULT_MIX,
                ...storedSettings.mix,
                weights: { ...DEFAULT_MIX.weights, ...storedSettings.mix?.weights },
              },
            }
          : { round: 0, delays: DEFAULT_DELAYS, sessionSize: SESSION_SIZE, mix: DEFAULT_MIX, seed: 0 },
      );
    });
  }, []);

  // Solange der gespeicherte Stand lädt, zeigen wir ein Skeleton.
  if (!progress || !settings || !disabled) return <ListSkeleton />;

  // Optimistisch: die UI übernimmt sofort, bei Speicherfehler geht es zurück zum alten Stand.
  function save(next: ProgressMap) {
    const previous = progress!;
    setProgress(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => setProgress(previous));
  }

  function rate(cardId: string, rating: Rating) {
    const next = review(progress![cardId], rating, settings!.round, settings!.delays);
    save({ ...progress!, [cardId]: next });
    return next;
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

  function setMix(mix: DifficultyMix) {
    updateSettings({ ...settings!, mix });
  }

  function setCardDisabled(cardId: string, value: boolean) {
    const previous = disabled!;
    const next = new Set(previous);
    if (value) next.add(cardId);
    else next.delete(cardId);
    setDisabled(next);
    AsyncStorage.setItem(DISABLED_KEY, JSON.stringify([...next])).catch(() => setDisabled(previous));
  }

  // Lernstand bleibt, nur die Reihenfolge der neuen Karten wird neu ausgelost.
  function reshuffle() {
    updateSettings({ ...settings!, seed: Math.floor(Math.random() * 2 ** 31) + 1 });
  }

  // Deaktivierte Karten bleiben deaktiviert: das ist eine bewusste Wahl, kein Lernstand.
  function reset() {
    save({});
    updateSettings({ ...settings!, round: 0 });
  }

  return (
    <ProgressContext.Provider
      value={{
        progress,
        round: settings.round,
        delays: settings.delays,
        sessionSize: settings.sessionSize,
        mix: settings.mix,
        seed: settings.seed,
        disabled,
        setSessionSize,
        setMix,
        rate,
        advanceRound,
        setDelay,
        setCardDisabled,
        reshuffle,
        reset,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress muss innerhalb von ProgressProvider genutzt werden");
  return value;
}
