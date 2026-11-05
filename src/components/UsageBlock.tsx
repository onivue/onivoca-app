import { Lightbulb, PenLine, Sparkles } from "lucide-react-native";
import { View } from "react-native";
import { Usage } from "../data/cards";
import { colors } from "../theme/colors";
import { Text } from "./Text";
import { themed, useTheme } from "../theme/theme";

type Props = { usage?: Usage; mnemonic?: string; color: string; accent: string };

// Gebrauchshinweise: Wortverbindungen, Grammatik, Tipp und Merkhilfe.
export function UsageBlock({ usage, mnemonic, color, accent }: Props) {
  useTheme();
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
      {usage?.grammar && (
        <View style={styles.grammarRow}>
          <PenLine color={accent} size={16} />
          <Text style={styles.grammar}>{usage.grammar}</Text>
        </View>
      )}
      {usage?.tip && (
        <View style={[styles.note, { backgroundColor: color }]}>
          <Lightbulb color={accent} size={20} />
          <Text style={styles.noteText}>{usage.tip}</Text>
        </View>
      )}
      {mnemonic && (
        <View style={[styles.note, { backgroundColor: color }]}>
          <Sparkles color={accent} size={20} />
          <View style={styles.noteBody}>
            <Text style={[styles.noteLabel, { color: accent }]}>Merkhilfe</Text>
            <Text style={styles.noteText}>{mnemonic}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = themed(() => ({
  wrap: { gap: 16 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 14, color: colors.text },
  grammarRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  grammar: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.muted },
  noteBody: { flex: 1, gap: 4 },
  note: { flexDirection: "row", gap: 12, borderRadius: 16, padding: 16 },
  noteLabel: { fontSize: 12, fontWeight: "700", textTransform: "uppercase" },
  noteText: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.text },
}));
