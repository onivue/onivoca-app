import { LucideIcon, RotateCcw, ThumbsUp, Zap } from "lucide-react-native";
import { Rating } from "../lib/srs";
import { colors } from "./colors";

// Anzeige der drei Bewertungen (Lernen-Buttons und Detailseite).
export const RATINGS: Record<Rating, { label: string; color: string; Icon: LucideIcon }> = {
  again: { label: "Nochmal", color: colors.danger, Icon: RotateCcw },
  good: { label: "Gut", color: colors.primary, Icon: ThumbsUp },
  easy: { label: "Einfach", color: colors.success, Icon: Zap },
};

export const RATING_ORDER: Rating[] = ["again", "good", "easy"];
