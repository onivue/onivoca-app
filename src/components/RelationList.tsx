import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { RELATION_LABELS, RELATION_ORDER, Relation } from "../data/cards";
import { useCards } from "../state/cards";
import { colors } from "../theme/colors";
import { Text } from "./Text";

type Props = { relations: Relation[]; accent: string; interactive?: boolean };

// Wortnetz nach Beziehungstyp gruppiert. Chips mit existierender Karte sind antippbar (nur wenn interactive).
export function RelationList({ relations, accent, interactive = false }: Props) {
  const router = useRouter();
  const cards = useCards();
  const known = new Set(cards.map((c) => c.id));

  const groups = RELATION_ORDER.map((type) => ({
    type,
    items: relations.filter((r) => r.type === type),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;
  return (
    <View style={styles.wrap}>
      {groups.map(({ type, items }) => (
        <View key={type} style={styles.group}>
          <Text style={styles.label}>{RELATION_LABELS[type]}</Text>
          <View style={styles.chips}>
            {items.map((r) => {
              const target = r.ref && known.has(r.ref) ? r.ref : undefined;
              const open = interactive && target;
              return (
                <Pressable
                  key={`${r.word}-${r.ref ?? ""}`}
                  disabled={!open}
                  style={[styles.chip, target ? { backgroundColor: accent } : styles.chipPlain]}
                  onPress={() => router.push(`/word/${target}`)}
                >
                  <Text style={[styles.chipText, target && styles.chipTextLink]}>{r.word}</Text>
                </Pressable>
              );
            })}
          </View>
          {items.map((r) => r.noteDe && <Text key={`n-${r.word}`} style={styles.noteDe}>{r.word}: {r.noteDe}</Text>)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  group: { gap: 6 },
  label: { fontSize: 12, fontWeight: "600", color: colors.muted, textTransform: "uppercase" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  chipPlain: { backgroundColor: colors.background },
  chipText: { fontSize: 14, color: colors.text },
  chipTextLink: { color: "#fff", fontWeight: "600" },
  noteDe: { fontSize: 13, color: colors.muted },
});
