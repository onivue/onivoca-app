// Hilfsmittel für die Store-Screenshots (scripts/screenshots). Nur in Builds aktiv, die mit
// EXPO_PUBLIC_SCREENSHOT_MODE=1 gebaut wurden; in normalen Builds ist alles hier ein No-op.
//
// Der Aufnahme-Ablauf legt unter "screenshot-nav" (AsyncStorage) eine Liste von Pfaden ab, die die App nach dem
// Start nacheinander öffnet (z. B. ["/words", "/word/gorge"]). Ein Deep-Link per simctl geht nicht:
// iOS fragt bei eigenen Schemata «In onivoca öffnen?».
//
// Die Lernseite versteht dann Parameter, z. B. /?card=embrace&flipped=1
//   card=<id>        diese Karte zuerst zeigen (Vorderseite, nicht umgekehrt)
//   flipped=1        Karte schon umgedreht, Bewertungsknöpfe sichtbar
//   summary=<id,id>  Rundenübersicht mit diesen Karten (Bewertungen abwechselnd)
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { WordEntry } from "../data/cards";
import { Rating, SessionItem, review } from "./srs";
import type { RoundResult } from "../components/RoundSummary";

export const SCREENSHOT_MODE = process.env.EXPO_PUBLIC_SCREENSHOT_MODE === "1";

export type Scene = { card?: string; flipped?: string; summary?: string };

// Öffnet die Pfade aus "screenshot-nav": der erste ersetzt die Startseite, jeder weitere wird darauf gelegt.
export function useScreenshotNavigation() {
  const router = useRouter();
  useEffect(() => {
    if (!SCREENSHOT_MODE) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    AsyncStorage.getItem("screenshot-nav")
      .then((raw) => {
        const paths: string[] = raw ? JSON.parse(raw) : [];
        paths.forEach((path, index) => {
          timers.push(setTimeout(() => (index === 0 ? router.replace(path as never) : router.push(path as never)), 1200 + index * 2500));
        });
      })
      .catch(() => {});
    return () => timers.forEach(clearTimeout);
  }, [router]);
}

export function useScreenshotScene(): Scene | null {
  const params = useLocalSearchParams<Scene>();
  if (!SCREENSHOT_MODE) return null;
  return params.card || params.summary ? params : null;
}

const SUMMARY_RATINGS: Rating[] = ["easy", "good", "good", "again", "easy", "good", "good", "easy"];

// Ersetzt die zufällige Runde durch die Karten der Szene.
export function applyScene(scene: Scene, cards: WordEntry[], queue: SessionItem[], round: number) {
  const byId = (id: string) => cards.find((c) => c.id === id);
  if (scene.summary) {
    const results: RoundResult[] = scene.summary
      .split(",")
      .map(byId)
      .filter((card): card is WordEntry => !!card)
      .map((card, index) => {
        const rating = SUMMARY_RATINGS[index % SUMMARY_RATINGS.length];
        return { item: { card, reverse: false }, rating, before: undefined, after: review(undefined, rating, round), round };
      });
    return { queue: [], results, flipped: false };
  }
  const card = scene.card ? byId(scene.card) : undefined;
  const first: SessionItem[] = card ? [{ card, reverse: false }] : [];
  return { queue: [...first, ...queue.filter((item) => item.card.id !== card?.id)], results: [], flipped: scene.flipped === "1" };
}
