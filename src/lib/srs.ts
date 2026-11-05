// Lernlogik ohne Termine: Jede Karte sammelt Punkte. Es gibt keine Fristen,
// man lernt einfach in Runden, so oft und so lange man will.
//
// - "Nochmal" -> 2 Punkte weniger
// - "Gut"     -> 1 Punkt mehr
// - "Einfach" -> 2 Punkte mehr
// Ab MASTERED_SCORE Punkten gilt eine Karte als gelernt.
import { WordEntry } from "../data/cards";

export type Rating = "again" | "good" | "easy";
export type Status = "new" | "learning" | "mastered";

export type CardProgress = {
  score: number;
  again: number;
  good: number;
  easy: number;
  dueRound?: number;
  history: Rating[]; // neueste Entscheidung zuerst
};
export type ProgressMap = Record<string, CardProgress>;
export type RoundDelays = { again: number; good: number };

export const MASTERED_SCORE = 4;
export const LEARNING_SLOTS = 5;
export const SESSION_SIZE = 10;
export const SESSION_SIZES = [10, 15, 20, 25, 30];
const LEARNING_PER_SESSION = LEARNING_SLOTS;
export const EASY_DELAY = 6;
const REVERSE_CHANCE = 0.5;
const HISTORY_LENGTH = 10;
export const SCORE_CHANGE: Record<Rating, number> = { again: -2, good: 1, easy: 2 };

const EMPTY: CardProgress = { score: 0, again: 0, good: 0, easy: 0, history: [] };

// Neuer Lernstand einer Karte nach einer Bewertung.
export function review(
  progress: CardProgress | undefined,
  rating: Rating,
  currentRound = 0,
  delays: RoundDelays = { again: 1, good: 3 },
): CardProgress {
  const p = progress ?? EMPTY;
  const score = Math.min(Math.max(p.score + SCORE_CHANGE[rating], 0), MASTERED_SCORE);
  return {
    ...p,
    score,
    dueRound: currentRound + (rating === "again" ? delays.again : rating === "good" ? delays.good : EASY_DELAY),
    again: p.again + (rating === "again" ? 1 : 0),
    good: p.good + (rating === "good" ? 1 : 0),
    easy: p.easy + (rating === "easy" ? 1 : 0),
    history: [rating, ...p.history].slice(0, HISTORY_LENGTH),
  };
}

export function getStatus(progress: CardProgress | undefined): Status {
  if (!progress) return "new";
  return progress.score >= MASTERED_SCORE ? "mastered" : "learning";
}

// Wie oft die Karte schon bewertet wurde.
export function timesSeen(progress: CardProgress | undefined) {
  return progress ? progress.again + progress.good + progress.easy : 0;
}

// Übersicht: wie viele Karten sind neu, am Lernen oder gelernt?
export function summarize(cards: WordEntry[], progress: ProgressMap) {
  const counts = { new: 0, learning: 0, mastered: 0 };
  for (const card of cards) counts[getStatus(progress[card.id])] += 1;
  return { ...counts, total: cards.length, open: counts.new + counts.learning };
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

// Eine Runde: ein paar Karten, die noch wackeln, dann neue Karten.
// Sind alle gelernt, gibt es eine Auffrischung mit zufälligen Karten.
// Schon bekannte Karten werden manchmal umgekehrt gefragt (Deutsch -> Englisch).
export type SessionItem = { card: WordEntry; reverse: boolean };

export function buildSession(cards: WordEntry[], progress: ProgressMap, round = 0, size = SESSION_SIZE): SessionItem[] {
  const byStatus = (status: Status) =>
    cards.filter((c) => getStatus(progress[c.id]) === status && (progress[c.id]?.dueRound ?? 0) <= round);
  const learning = byStatus("learning").sort((a, b) => progress[a.id].score - progress[b.id].score);

  return [
    ...learning.slice(0, LEARNING_PER_SESSION),
    ...byStatus("new"),
    ...learning.slice(LEARNING_PER_SESSION),
    ...shuffle(byStatus("mastered")),
  ]
    .slice(0, size)
    .map((card) => ({ card, reverse: !!progress[card.id] && Math.random() < REVERSE_CHANCE }));
}
