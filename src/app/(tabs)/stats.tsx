import { Link } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";
import { PressableScale } from "../../components/PressableScale";
import { ProgressBar } from "../../components/ProgressBar";
import { Screen } from "../../components/Screen";
import { Text } from "../../components/Text";
import { summarize } from "../../lib/srs";
import { useCards } from "../../state/cards";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";

// Tab 3: Überblick über den Lernfortschritt.
export default function StatsScreen() {
  const { progress, reset } = useProgress();
  const cards = useCards();
  const summary = summarize(cards, progress);

  function confirmReset() {
    Alert.alert("Fortschritt zurücksetzen?", "Alle Karten beginnen wieder bei null.", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Zurücksetzen", style: "destructive", onPress: reset },
    ]);
  }

  return (
    <Screen title="Fortschritt">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gelernt</Text>
        <Text style={styles.big}>
          {summary.mastered} <Text style={styles.bigMuted}>/ {summary.total}</Text>
        </Text>
        <ProgressBar value={summary.mastered / summary.total} />
        <Text style={styles.open}>Noch {summary.open} Karten offen</Text>
      </View>

      <View style={styles.tiles}>
        <Tile label="Neu" value={summary.new} color={colors.primary} />
        <Tile label="Am Lernen" value={summary.learning} color={colors.warning} />
        <Tile label="Gelernt" value={summary.mastered} color={colors.success} />
      </View>

      <PressableScale style={styles.reset} onPress={confirmReset}>
        <Text style={styles.resetText}>Fortschritt zurücksetzen</Text>
      </PressableScale>

      <Link href="/privacy" asChild>
        <PressableScale style={styles.privacy} accessibilityRole="link">
          <Text style={styles.privacyText}>Datenschutzerklärung</Text>
        </PressableScale>
      </Link>
    </Screen>
  );
}

function Tile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.tile, { backgroundColor: color }]}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 20, gap: 10 },
  cardTitle: { fontSize: 13, fontWeight: "600", color: colors.muted, textTransform: "uppercase" },
  big: { fontSize: 48, fontWeight: "700", color: colors.text },
  bigMuted: { fontSize: 24, color: colors.muted },
  open: { fontSize: 15, color: colors.muted },
  tiles: { flexDirection: "row", gap: 10 },
  tile: { flex: 1, borderRadius: 20, padding: 16, gap: 4 },
  tileValue: { fontSize: 32, fontWeight: "700", color: colors.text },
  tileLabel: { fontSize: 13, fontWeight: "500", color: colors.muted },
  reset: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  resetText: { color: "#E11D48", fontSize: 16, lineHeight: 22, fontWeight: "500" },
  privacy: { alignItems: "center", paddingVertical: 12 },
  privacyText: { color: colors.muted, fontSize: 14, lineHeight: 20, textDecorationLine: "underline" },
});
