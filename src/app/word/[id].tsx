import { useLocalSearchParams, useRouter } from "expo-router";
import { Volume2 } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { ExampleList } from "../../components/ExampleList";
import { ProgressBar } from "../../components/ProgressBar";
import { RelationList } from "../../components/RelationList";
import { Screen } from "../../components/Screen";
import { StatusPill } from "../../components/StatusPill";
import { Text } from "../../components/Text";
import { UsageBlock } from "../../components/UsageBlock";
import { WordMeta } from "../../components/WordMeta";
import { CLUSTER_LABELS, TOPICS } from "../../data/cards";
import { speak } from "../../lib/speak";
import { getStatus, MASTERED_SCORE, timesSeen } from "../../lib/srs";
import { useCards } from "../../state/cards";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";
import { RATING_ORDER, RATINGS } from "../../theme/ratings";

// Detailseite eines Worts: Inhalt der Karte und der eigene Lernverlauf.
export default function WordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { progress } = useProgress();
  const router = useRouter();

  const cards = useCards();

  const card = cards.find((c) => c.id === id);
  if (!card) return null;

  const category = TOPICS[card.topics[0] ?? "daily"];
  const p = progress[card.id];
  const clusterMates = cards.filter((c) => c.id !== card.id && c.clusters.some((cl) => card.clusters.includes(cl)));

  return (
    <Screen title={card.lemma}>
      <View style={[styles.hero, { backgroundColor: category.color }]}>
        <View style={styles.heroTexts}>
          {card.ipa && <Text style={styles.phonetic}>{card.ipa}</Text>}
          <Text style={[styles.translation, { color: category.accent }]}>{card.de}</Text>
          {card.deAlt && card.deAlt.length > 0 && <Text style={styles.phonetic}>{card.deAlt.join(" · ")}</Text>}
          <WordMeta level={card.level} pos={card.pos} register={card.register} />
        </View>
        <Pressable style={styles.speakButton} onPress={() => speak(card.lemma)} hitSlop={10}>
          <Volume2 color={colors.text} size={26} />
        </Pressable>
      </View>

      {card.definitionEn && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bedeutung</Text>
          <Text style={styles.definition}>{card.definitionEn}</Text>
        </View>
      )}

      {card.examples.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Beispiele</Text>
          <ExampleList examples={card.examples} accent={category.accent} />
        </View>
      )}

      {(card.usage || card.mnemonic) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verwendung</Text>
          <UsageBlock usage={card.usage} mnemonic={card.mnemonic} color={category.color} accent={category.accent} />
        </View>
      )}

      {card.relations.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Wortnetz</Text>
          <RelationList relations={card.relations} accent={category.accent} interactive />
        </View>
      )}

      {clusterMates.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Lerngruppe: {card.clusters.map((c) => CLUSTER_LABELS[c] ?? c).join(", ")}
          </Text>
          <View style={styles.chips}>
            {clusterMates.map((mate) => (
              <Pressable key={mate.id} style={styles.chip} onPress={() => router.push(`/word/${mate.id}`)}>
                <Text style={styles.chipText}>{mate.lemma}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.statusRow}>
          <Text style={styles.cardTitle}>Dein Lernstand</Text>
          <StatusPill status={getStatus(p)} />
        </View>
        <ProgressBar value={(p?.score ?? 0) / MASTERED_SCORE} />
        <Text style={styles.seen}>
          {timesSeen(p) === 0 ? "Noch nicht gelernt" : `Schon ${timesSeen(p)}-mal vorgekommen`}
        </Text>

        <View style={styles.counts}>
          {RATING_ORDER.map((rating) => {
            const { label, color, Icon } = RATINGS[rating];
            return (
              <View key={rating} style={[styles.count, { backgroundColor: color }]}>
                <Icon color={colors.text} size={20} />
                <Text style={styles.countValue}>{p?.[rating] ?? 0}</Text>
                <Text style={styles.countLabel}>{label}</Text>
              </View>
            );
          })}
        </View>

        {p && p.history.length > 0 && (
          <View style={styles.history}>
            <Text style={styles.cardTitle}>Letzte Entscheidungen</Text>
            <View style={styles.historyRow}>
              {p.history.map((rating, index) => {
                const { color, Icon } = RATINGS[rating];
                return (
                  <View key={index} style={[styles.historyDot, { backgroundColor: color }]}>
                    <Icon color={colors.text} size={14} />
                  </View>
                );
              })}
            </View>
            <Text style={styles.historyHint}>Neueste zuerst</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 24, padding: 20, flexDirection: "row", alignItems: "center", gap: 12 },
  heroTexts: { flex: 1, gap: 4 },
  phonetic: { fontSize: 18, color: colors.muted },
  translation: { fontSize: 26, fontWeight: "700" },
  speakButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 20, gap: 12 },
  cardTitle: { fontSize: 13, fontWeight: "600", color: colors.muted, textTransform: "uppercase" },
  definition: { fontSize: 16, fontStyle: "italic", color: colors.text },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { backgroundColor: colors.background, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 14, color: colors.text },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  seen: { fontSize: 15, color: colors.text },
  counts: { flexDirection: "row", gap: 10 },
  count: { flex: 1, borderRadius: 16, padding: 12, alignItems: "center", gap: 2 },
  countValue: { fontSize: 24, fontWeight: "700", color: colors.text },
  countLabel: { fontSize: 12, color: colors.muted },
  history: { gap: 8 },
  historyRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  historyDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  historyHint: { fontSize: 12, color: colors.muted },
});
