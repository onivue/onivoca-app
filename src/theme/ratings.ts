import { LucideIcon, RotateCcw, ThumbsUp, Zap } from "lucide-react-native";
import { Rating } from "../lib/srs";
import { colors } from "./colors";

// Anzeige der drei Bewertungen (Lernen-Buttons und Detailseite).
// Getter, damit die Farben beim Rendern im aktuellen Design gelesen werden.
export const RATINGS: Record<Rating, { label: string; color: string; textColor: string; Icon: LucideIcon }> = {
  again: {
    label: "Nochmal",
    get color() { return colors.danger; },
    get textColor() { return colors.onDanger; },
    Icon: RotateCcw,
  },
  good: {
    label: "Gut",
    get color() { return colors.primary; },
    get textColor() { return colors.onPrimary; },
    Icon: ThumbsUp,
  },
  easy: {
    label: "Einfach",
    get color() { return colors.success; },
    get textColor() { return colors.onSuccess; },
    Icon: Zap,
  },
};

export const RATING_ORDER: Rating[] = ["again", "good", "easy"];
