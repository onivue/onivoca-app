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
  const { progress, delays, setDelay, reset } = useProgress();
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
        <Tile label="Offen" value={summary.new} color={colors.primary} />
        <Tile label="Am Lernen" value={summary.learning} color={colors.warning} />
        <Tile label="Gelernt" value={summary.mastered} color={colors.success} />
      </View>

      <View style={styles.spacingSection}>
        <Text style={styles.sectionTitle}>Wiederholungsabstand</Text>
        <Text style={styles.sectionHint}>Karten werden frühestens nach der gewählten Anzahl Runden wieder gezeigt.</Text>
        <DelayControl label="Nochmal" value={delays.again} options={[1, 2]} onChange={(rounds) => setDelay("again", rounds)} />
        <DelayControl label="Gut" value={delays.good} options={[3, 5]} onChange={(rounds) => setDelay("good", rounds)} />
      </View>

      <PressableScale style={styles.reset} onPress={confirmReset}>
        <Text style={styles.resetText}>Fortschritt zurücksetzen</Text>
      </PressableScale>

      <Link href="/privacy" asChild>
        <PressableScale style={styles.privacy} accessibilityRole="link">
          <Text style={styles.privacyText}>Datenschutzerklärung</Text>
        </PressableScale>
      </Link>
      <Link href="/licenses" asChild>
        <PressableScale style={styles.privacy} accessibilityRole="link">
          <Text style={styles.privacyText}>Drittanbieter-Lizenzen</Text>
        </PressableScale>
      </Link>
    </Screen>
  );
}

function Tile({ label, value, color }: { label: string; value: number; color: string }) {
  const foreground = color === colors.primary ? "#30365B" : color === colors.success ? "#24523A" : "#614A16";
  return (
    <View style={[styles.tile, { backgroundColor: color }]}>
      <Text style={[styles.tileValue, { color: foreground }]}>{value}</Text>
      <Text style={[styles.tileLabel, { color: foreground }]}>{label}</Text>
    </View>
  );
}

function DelayControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: number[];
  onChange: (rounds: number) => void;
}) {
  return (
    <View style={styles.delayRow}>
      <Text style={styles.delayLabel}>{label}</Text>
      <View style={styles.delayOptions}>
        {options.map((rounds) => (
          <PressableScale
            key={rounds}
            style={[styles.delayOption, value === rounds && styles.delayOptionSelected]}
            onPress={() => onChange(rounds)}
            accessibilityRole="button"
            accessibilityState={{ selected: value === rounds }}
          >
            <Text style={[styles.delayOptionText, value === rounds && styles.delayOptionTextSelected]}>
              {rounds === 1 ? "Nächste Runde" : `In ${rounds} Runden`}
            </Text>
          </PressableScale>
        ))}
      </View>
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
  tile: { flex: 1, borderRadius: 16, padding: 16, gap: 4 },
  tileValue: { fontSize: 32, fontWeight: "700" },
  tileLabel: { fontSize: 13, fontWeight: "600" },
  spacingSection: { gap: 10, paddingVertical: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  sectionHint: { fontSize: 14, lineHeight: 20, color: colors.muted },
  delayRow: { gap: 8 },
  delayLabel: { fontSize: 15, fontWeight: "600", color: colors.text },
  delayOptions: { flexDirection: "row", gap: 8 },
  delayOption: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 8,
  },
  delayOptionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  delayOptionText: { color: colors.muted, fontSize: 13, fontWeight: "600", textAlign: "center" },
  delayOptionTextSelected: { color: "#30365B" },
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
