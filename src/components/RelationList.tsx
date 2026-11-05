import { ArrowLeftRight, Equal, GitCompareArrows, Link2, Network, Sprout } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { RELATION_LABELS, RELATION_ORDER, Relation, RelationType } from "../data/cards";
import { useCards } from "../state/cards";
import { colors } from "../theme/colors";
import { Text } from "./Text";
import { themed, useTheme } from "../theme/theme";

const ICONS: Record<RelationType, typeof Equal> = {
  synonym: Equal,
  antonym: ArrowLeftRight,
  confusable: GitCompareArrows,
  family: Sprout,
  collocate: Link2,
  related: Network,
};

type Props = { relations: Relation[]; accent: string; interactive?: boolean };

// Wortnetz nach Beziehungstyp gruppiert. Chips mit existierender Karte sind antippbar (nur wenn interactive).
export function RelationList({ relations, accent, interactive = false }: Props) {
  useTheme();
  const router = useRouter();
  const cards = useCards();
  const known = new Set(cards.map((c) => c.id));
  // Verweise ohne ref werden über das Lemma gefunden (z. B. "happy" -> Karte "happy").
  const byLemma = new Map(cards.map((c) => [c.lemma.toLocaleLowerCase("en"), c.id]));

  const groups = RELATION_ORDER.map((type) => ({
    type,
    items: relations.filter((r) => r.type === type),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;
  return (
    <View style={styles.wrap}>
      {groups.map(({ type, items }) => (
        <View key={type} style={styles.group}>
          <View style={styles.labelRow}>
            {(() => {
              const Icon = ICONS[type];
              return <Icon color={colors.muted} size={14} />;
            })()}
            <Text style={styles.label}>{RELATION_LABELS[type]}</Text>
          </View>
          <View style={styles.chips}>
            {items.map((r) => {
              const target = r.ref && known.has(r.ref) ? r.ref : byLemma.get(r.word.toLocaleLowerCase("en"));
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

const styles = themed(() => ({
  wrap: { gap: 18 },
  group: { gap: 8 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { fontSize: 12, fontWeight: "600", color: colors.muted, textTransform: "uppercase" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
  chipPlain: { backgroundColor: colors.background },
  chipText: { fontSize: 14, color: colors.text },
  chipTextLink: { color: colors.onAccent, fontWeight: "600" },
  noteDe: { fontSize: 13, color: colors.muted },
}));
