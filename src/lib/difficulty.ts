// Schwierigkeits-Mix: wie viele Karten welcher Stufe (A1–C2) in eine Runde kommen.
// Gemischt wird nur über die Stufen, die es im aktuellen Deck gibt (Englisch z. B. A2–C2, Spanisch A1–B1).
//
// - "off":    keine Gewichtung, die Runde folgt nur dem Lernstand (bisheriges Verhalten)
// - "preset": Vorlage (sanft, ausgewogen, Profi), berechnet aus den vorhandenen Stufen
// - "custom": eigene Gewichte pro Stufe (0–5) aus dem Mischpult
// - "flow":   die Gewichte folgen der Trefferquote. Sitzt eine Stufe, wandert der Schwerpunkt
//             zur nächsten; die Nachbarstufen bleiben mit weniger Gewicht dabei.
import { LEVELS, type Level, type WordEntry } from "../data/cards";
import type { ProgressMap } from "./srs";

export type LevelWeights = Record<Level, number>;
export type MixMode = "off" | "preset" | "custom" | "flow";
export type PresetId = "gentle" | "balanced" | "pro";
export type DifficultyMix = { mode: MixMode; preset: PresetId; weights: LevelWeights };

export const MAX_WEIGHT = 5;
const EMPTY: LevelWeights = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
export const DEFAULT_MIX: DifficultyMix = {
  mode: "off",
  preset: "balanced",
  weights: { A1: 3, A2: 3, B1: 3, B2: 3, C1: 3, C2: 3 },
};

export const PRESETS: { id: PresetId; label: string }[] = [
  { id: "gentle", label: "Sanft" },
  { id: "balanced", label: "Ausgewogen" },
  { id: "pro", label: "Profi" },
];

// Flow: Trefferquote, ab der eine Stufe "sitzt", und darunter, ab der sie noch gar nicht sitzt.
export const FLOW_UPPER = 0.85;
export const FLOW_LOWER = 0.55;
// Vorwissen für Stufen ohne Bewertungen (3 von 4 gewusst), damit Flow nicht ganz unten startet.
const PRIOR_HITS = 3;
const PRIOR_MISSES = 1;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Anzahl Karten pro Stufe; Karten ohne Stufe (z. B. Satzkarten) zählen nicht.
export function countLevels(cards: WordEntry[]): LevelWeights {
  const counts = { ...EMPTY };
  for (const card of cards) if (card.level) counts[card.level] += 1;
  return counts;
}

// Stufen, die im Deck vorkommen, von leicht nach schwer.
export function presentLevels(counts: LevelWeights): Level[] {
  return LEVELS.filter((level) => counts[level] > 0);
}

// Vorlage auf die vorhandenen Stufen verteilt: sanft fällt von 5 auf 0, Profi steigt, ausgewogen bleibt gleich.
export function presetWeights(preset: PresetId, levels: Level[]): LevelWeights {
  const weights = { ...EMPTY };
  levels.forEach((level, i) => {
    const position = levels.length > 1 ? i / (levels.length - 1) : 0.5; // 0 = leichteste, 1 = schwerste
    weights[level] =
      preset === "balanced" ? 3 : Math.round(MAX_WEIGHT * (preset === "gentle" ? 1 - position : position));
  });
  return weights;
}

export type LevelStat = { cards: number; ratings: number; hitRate: number | null; smoothed: number };

// Trefferquote pro Stufe aus den letzten Bewertungen jeder Karte ("Gut" und "Einfach" zählen als gewusst).
export function levelStats(cards: WordEntry[], progress: ProgressMap): Record<Level, LevelStat> {
  const raw = Object.fromEntries(LEVELS.map((l) => [l, { cards: 0, hits: 0, ratings: 0 }])) as Record<
    Level,
    { cards: number; hits: number; ratings: number }
  >;
  for (const card of cards) {
    if (!card.level) continue;
    const entry = raw[card.level];
    entry.cards += 1;
    for (const rating of progress[card.id]?.history ?? []) {
      entry.ratings += 1;
      if (rating !== "again") entry.hits += 1;
    }
  }
  return Object.fromEntries(
    LEVELS.map((l) => {
      const { cards: n, hits, ratings } = raw[l];
      const stat: LevelStat = {
        cards: n,
        ratings,
        hitRate: ratings > 0 ? hits / ratings : null,
        smoothed: (hits + PRIOR_HITS) / (ratings + PRIOR_HITS + PRIOR_MISSES),
      };
      return [l, stat];
    }),
  ) as Record<Level, LevelStat>;
}

// Flow-Punkt als Position in `levels` (0 = leichteste Stufe): Jede Stufe zählt nur so weit,
// wie alle leichteren schon sitzen. So rückt der Schwerpunkt Stufe für Stufe nach oben.
// Klappt die Stufe im Schwerpunkt selbst nicht, rückt er um bis zu eine halbe Stufe zurück.
export function flowCenter(stats: Record<Level, LevelStat>, levels: Level[]) {
  const mastery = (level: Level) => clamp((stats[level].smoothed - FLOW_LOWER) / (FLOW_UPPER - FLOW_LOWER), 0, 1);
  let center = 0;
  let gate = 1;
  for (const level of levels.slice(0, -1)) {
    gate *= mastery(level);
    center += gate;
  }
  const focus = levels[Math.round(center)];
  return focus && center > 0 ? Math.max(0, center - (1 - mastery(focus)) * 0.5) : center;
}

// Gewichte rund um den Flow-Punkt: dort am meisten, Nachbarn weniger, keine Stufe ganz ohne.
export function flowWeights(center: number, levels: Level[]): LevelWeights {
  const weights = { ...EMPTY };
  levels.forEach((level, i) => {
    weights[level] = Math.max(0.08, 1 - Math.abs(i - center) * 0.45) * MAX_WEIGHT;
  });
  return weights;
}

// Gewichte für eine Runde, oder null, wenn ohne Mix gelernt wird.
export function resolveWeights(mix: DifficultyMix, cards: WordEntry[], progress: ProgressMap): LevelWeights | null {
  if (mix.mode === "off") return null;
  const levels = presentLevels(countLevels(cards));
  if (levels.length === 0) return null;
  if (mix.mode === "preset") return presetWeights(mix.preset, levels);
  if (mix.mode === "custom") return mix.weights;
  return flowWeights(flowCenter(levelStats(cards, progress), levels), levels);
}

// Verteilt `size` Plätze nach Gewicht (Methode des größten Rests).
export function allocate(size: number, weights: LevelWeights): LevelWeights {
  const total = LEVELS.reduce((sum, l) => sum + weights[l], 0);
  const result = { ...EMPTY };
  if (total <= 0) return result;
  const exact = LEVELS.map((l) => ({ l, value: (weights[l] / total) * size }));
  for (const { l, value } of exact) result[l] = Math.floor(value);
  let left = size - LEVELS.reduce((sum, l) => sum + result[l], 0);
  for (const { l } of [...exact].sort((a, b) => (b.value % 1) - (a.value % 1))) {
    if (left <= 0) break;
    result[l] += 1;
    left -= 1;
  }
  return result;
}

// Wählt aus der nach Dringlichkeit sortierten Liste eine Runde im gewünschten Mix.
// Reicht eine Stufe nicht, füllen zuerst die anderen gewichteten Stufen auf, danach alle übrigen,
// damit eine Runde nie leer bleibt. Die Reihenfolge der Dringlichkeit bleibt erhalten.
export function pickByMix(ordered: WordEntry[], size: number, weights: LevelWeights): WordEntry[] {
  if (!ordered.some((card) => card.level)) return ordered.slice(0, size);

  const pools = Object.fromEntries(LEVELS.map((l) => [l, [] as WordEntry[]])) as Record<Level, WordEntry[]>;
  for (const card of ordered) if (card.level) pools[card.level].push(card);

  // Stufen ohne fällige Karten geben ihr Gewicht an die anderen ab.
  const available = { ...EMPTY };
  for (const l of LEVELS) available[l] = pools[l].length > 0 ? weights[l] : 0;
  const targets = allocate(Math.min(size, ordered.length), available);

  const picked = new Set<WordEntry>();
  for (const l of LEVELS) for (const card of pools[l].slice(0, targets[l])) picked.add(card);
  for (const card of ordered) {
    if (picked.size >= size) break;
    if (!card.level || weights[card.level] > 0) picked.add(card);
  }
  for (const card of ordered) {
    if (picked.size >= size) break;
    picked.add(card);
  }
  return ordered.filter((card) => picked.has(card));
}
