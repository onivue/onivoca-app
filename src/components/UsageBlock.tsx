import { Lightbulb } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { Usage } from "../data/cards";
import { colors } from "../theme/colors";
import { Text } from "./Text";

type Props = { usage?: Usage; mnemonic?: string; color: string; accent: string };

// Gebrauchshinweise: Wortverbindungen, Grammatik, Tipp und Merkhilfe.
export function UsageBlock({ usage, mnemonic, color, accent }: Props) {
  const collocations = usage?.collocations ?? [];
  if (collocations.length === 0 && !usage?.grammar && !usage?.tip && !mnemonic) return null;

  return (
    <View style={styles.wrap}>
      {collocations.length > 0 && (
        <View style={styles.chips}>
          {collocations.map((c) => (
            <View key={c} style={[styles.chip, { borderColor: accent }]}>
              <Text style={styles.chipText}>{c}</Text>
            </View>
          ))}
        </View>
      )}
      {usage?.grammar && <Text style={styles.grammar}>Grammatik: {usage.grammar}</Text>}
      {usage?.tip && (
        <View style={[styles.note, { backgroundColor: color }]}>
          <Lightbulb color={colors.text} size={18} />
          <Text style={styles.noteText}>{usage.tip}</Text>
        </View>
      )}
      {mnemonic && (
        <View style={[styles.note, { backgroundColor: color }]}>
          <Text style={styles.noteLabel}>Merkhilfe</Text>
          <Text style={styles.noteText}>{mnemonic}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 14, color: colors.text },
  grammar: { fontSize: 14, color: colors.muted },
  note: { flexDirection: "row", gap: 10, borderRadius: 14, padding: 12 },
  noteLabel: { fontSize: 13, fontWeight: "600", color: colors.text },
  noteText: { flex: 1, fontSize: 14, color: colors.text },
});
