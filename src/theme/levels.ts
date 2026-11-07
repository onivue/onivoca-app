import { Level } from "../data/cards";
import { colors } from "./colors";

// Farben der Stufen im Schwierigkeits-Mix und in der Rundenübersicht, gruppiert nach A, B und C.
// Getter, damit die Farben beim Rendern im aktuellen Design gelesen werden.
// Bewusst andere Farben als die Bewertungen, damit Stufe und Bewertung nicht verwechselt werden.
const GROUPS = {
  A: { get color() { return colors.sky; }, get strong() { return colors.onSky; } },
  B: { get color() { return colors.orange; }, get strong() { return colors.onOrange; } },
  C: { get color() { return colors.pink; }, get strong() { return colors.onPink; } },
};

export function levelStyle(level: Level): { color: string; strong: string } {
  return GROUPS[level[0] as keyof typeof GROUPS];
}
