import { Brain, Layers, Repeat, Sparkles, ThumbsUp, Trophy } from "lucide-react-native";
import { ReactNode } from "react";
import { Alert, View } from "react-native";
import { PressableScale } from "../../components/PressableScale";
import { ProgressRing } from "../../components/ProgressRing";
import { Screen } from "../../components/Screen";
import { Text } from "../../components/Text";
import { summarize } from "../../lib/srs";
import { useCards, useSentences } from "../../state/cards";
import { useLanguage } from "../../state/language";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";
import { themed, useTheme } from "../../theme/theme";

// Unterseite: alle Zahlen zum Lernstand und Zurücksetzen.
export default function ProgressScreen() {
  useTheme();
  const { progress, round, reset } = useProgress();
  const { deck } = useLanguage();
  const words = useCards();
  const sentences = useSentences();
  const showSentences = deck === "sentences" && sentences.length > 0;
  const summary = summarize(showSentences ? sentences : words, progress);
  const total = Math.max(summary.total, 1);

  const reviews = Object.values(progress).reduce(
    (sum, p) => ({ again: sum.again + p.again, good: sum.good + p.good, easy: sum.easy + p.easy }),
    { again: 0, good: 0, easy: 0 },
  );
  const reviewCount = reviews.again + reviews.good + reviews.easy;
  const hitRate = reviewCount > 0 ? Math.round(((reviews.good + reviews.easy) / reviewCount) * 100) : 0;

  function confirmReset() {
    Alert.alert("Fortschritt zurücksetzen?", "Alle Karten beginnen wieder bei null.", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Zurücksetzen", style: "destructive", onPress: reset },
    ]);
  }

  return (
    <Screen title="Fortschritt">
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <ProgressRing value={summary.mastered / total} color={colors.accent} label="gelernt" />
        <Text style={styles.heroText}>
          {summary.mastered} von {summary.total} {showSentences ? "Sätzen" : "Wörtern"} gelernt
        </Text>
        <View style={styles.stack}>
          <View style={[styles.stackPart, { flex: summary.mastered, backgroundColor: "#16A34A" }]} />
          <View style={[styles.stackPart, { flex: summary.learning, backgroundColor: "#F59E0B" }]} />
          <View style={[styles.stackPart, { flex: summary.new, backgroundColor: colors.overlay }]} />
        </View>
        <View style={styles.legend}>
          <Legend color="#16A34A" label="Gelernt" />
          <Legend color="#F59E0B" label="Am Lernen" />
          <Legend color="rgba(255,255,255,0.9)" label="Offen" />
        </View>
      </View>

      <View style={styles.tiles}>
        <Tile icon={<Sparkles color={colors.onPrimary} size={20} />} label="Offen" value={summary.new} color={colors.primary} fg={colors.onPrimary} />
        <Tile icon={<Brain color={colors.onWarning} size={20} />} label="Am Lernen" value={summary.learning} color={colors.warning} fg={colors.onWarning} />
        <Tile icon={<Trophy color={colors.onSuccess} size={20} />} label="Gelernt" value={summary.mastered} color={colors.success} fg={colors.onSuccess} />
      </View>
      <View style={styles.tiles}>
        <Tile icon={<Repeat color={colors.onOrange} size={20} />} label="Bewertungen" value={reviewCount} color={colors.orange} fg={colors.onOrange} />
        <Tile icon={<ThumbsUp color={colors.onSky} size={20} />} label="Trefferquote" value={`${hitRate}%`} color={colors.sky} fg={colors.onSky} />
        <Tile icon={<Layers color={colors.onPink} size={20} />} label="Runde" value={round + 1} color={colors.pink} fg={colors.onPink} />
      </View>

      <PressableScale style={styles.reset} onPress={confirmReset} accessibilityRole="button">
        <Text style={styles.resetText}>Fortschritt zurücksetzen</Text>
      </PressableScale>
    </Screen>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  useTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function Tile({ icon, label, value, color, fg }: { icon: ReactNode; label: string; value: number | string; color: string; fg: string }) {
  useTheme();
  return (
    <View style={[styles.tile, { backgroundColor: color }]}>
      {icon}
      <Text style={[styles.tileValue, { color: fg }]}>{value}</Text>
      <Text style={[styles.tileLabel, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = themed(() => ({
  hero: { borderRadius: 28, padding: 24, alignItems: "center", gap: 18 },
  heroText: { fontSize: 17, fontWeight: "600", color: colors.text },
  stack: { flexDirection: "row", alignSelf: "stretch", height: 14, borderRadius: 7, overflow: "hidden" },
  stackPart: { height: "100%" },
  legend: { flexDirection: "row", gap: 16, flexWrap: "wrap", justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: colors.text },
  tiles: { flexDirection: "row", gap: 10 },
  tile: { flex: 1, borderRadius: 20, padding: 14, gap: 4 },
  tileValue: { fontSize: 28, fontWeight: "800" },
  tileLabel: { fontSize: 12, fontWeight: "600" },
  reset: { alignItems: "center", backgroundColor: colors.card, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, marginTop: 8 },
  resetText: { color: "#E11D48", fontSize: 16, lineHeight: 22, fontWeight: "500" },
}));
