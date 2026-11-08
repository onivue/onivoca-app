import { useRouter } from "expo-router";
import { ArrowLeftRight, ChevronDown, ExternalLink, PartyPopper, Trophy, Volume2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated, LayoutAnimation, Pressable, ScrollView, View, useAnimatedValue } from "react-native";
import { LANGUAGES } from "../data/cards";
import { countLevels } from "../lib/difficulty";
import { speak } from "../lib/speak";
import { CardProgress, MASTERED_SCORE, Rating, SCORE_CHANGE, SessionItem, getStatus } from "../lib/srs";
import { useLanguage } from "../state/language";
import { colors } from "../theme/colors";
import { RATING_ORDER, RATINGS } from "../theme/ratings";
import { themed, useTheme } from "../theme/theme";
import { ExampleList } from "./ExampleList";
import { PressableScale } from "./PressableScale";
import { ProgressBar } from "./ProgressBar";
import { StatusPill } from "./StatusPill";
import { Text } from "./Text";
import { LevelBar } from "./LevelBar";
import { WordMeta } from "./WordMeta";

// Mindestbreite einer Bewertungskachel, bevor die Kacheln untereinander rutschen.
const TILE_MIN_WIDTH = 96;

// Eine Antwort der Runde: welche Karte, wie gefragt, was gewählt wurde und der Lernstand davor/danach.
export type RoundResult = { item: SessionItem; rating: Rating; before?: CardProgress; after: CardProgress; round: number };

// Übersicht am Ende einer Runde: Bilanz, Mix und alle Karten zum Aufklappen.
export function RoundSummary({ results, onNext }: { results: RoundResult[]; onNext: () => void }) {
  useTheme();
  const [filter, setFilter] = useState<Rating | null>(null);
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  // Reicht die Breite nicht für drei gleich breite Kacheln (z. B. grosse Schrift), stehen sie untereinander.
  const [stacked, setStacked] = useState(false);

  const counts = { again: 0, good: 0, easy: 0 };
  for (const r of results) counts[r.rating] += 1;
  const known = results.length > 0 ? Math.round(((counts.good + counts.easy) / results.length) * 100) : 0;
  const nowMastered = results.filter((r) => getStatus(r.before) !== "mastered" && getStatus(r.after) === "mastered").length;
  const levels = countLevels(results.map((r) => r.item.card));
  const hasLevels = Object.values(levels).some((n) => n > 0);
  const visible = filter ? results.filter((r) => r.rating === filter) : results;

  function toggle(id: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleFilter(rating: Rating) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilter((current) => (current === rating ? null : rating));
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <PartyPopper color={colors.text} size={44} />
          <Text style={styles.title}>Runde geschafft!</Text>
          <Text style={styles.subtitle}>
            {results.length === 0
              ? "Mach eine Pause oder gleich weiter, ganz wie du willst."
              : `${results.length} ${results.length === 1 ? "Karte" : "Karten"} · ${known} % gewusst`}
          </Text>
        </View>

        {results.length > 0 && (
          <>
            {/* Bewertungen, zugleich Filter für die Liste */}
            <View
              style={[styles.tiles, stacked && styles.tilesStacked]}
              onLayout={(e) => setStacked(e.nativeEvent.layout.width < TILE_MIN_WIDTH * RATING_ORDER.length)}
            >
              {RATING_ORDER.map((rating) => {
                const { label, color, textColor, Icon } = RATINGS[rating];
                const active = filter === rating;
                return (
                  // PressableScale legt den Style auf die innere View, darum sorgt die Zelle für die gleiche Breite.
                  <View key={rating} style={stacked ? undefined : styles.tileCell}>
                    <PressableScale
                      style={[styles.tile, stacked && styles.tileStacked, { backgroundColor: color }, filter && !active && styles.tileDimmed]}
                      onPress={() => toggleFilter(rating)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`${label}: ${counts[rating]} Karten, Liste filtern`}
                    >
                      <Icon color={textColor} size={18} />
                      <Text style={[styles.tileValue, { color: textColor }]}>{counts[rating]}</Text>
                      <Text style={[styles.tileLabel, { color: textColor }]} numberOfLines={1}>
                        {label}
                      </Text>
                    </PressableScale>
                  </View>
                );
              })}
            </View>

            {nowMastered > 0 && (
              <View style={styles.mastered}>
                <Trophy color={colors.onSuccess} size={18} />
                <Text style={styles.masteredText}>
                  {nowMastered} {nowMastered === 1 ? "Karte ist" : "Karten sind"} jetzt gelernt
                </Text>
              </View>
            )}

            {hasLevels && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Mix dieser Runde</Text>
                <LevelBar counts={levels} />
              </View>
            )}

            <View style={styles.listHead}>
              <Text style={styles.cardTitle}>{filter ? `Deine Karten · ${RATINGS[filter].label}` : "Deine Karten"}</Text>
              {filter && (
                <Pressable onPress={() => toggleFilter(filter)} hitSlop={10}>
                  <Text style={styles.clear}>Alle zeigen</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.list}>
              {visible.map((result) => (
                <ResultRow
                  key={result.item.card.id}
                  result={result}
                  open={open.has(result.item.card.id)}
                  onToggle={() => toggle(result.item.card.id)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <PressableScale style={styles.startButton} onPress={onNext}>
        <Text style={styles.startButtonText}>Neue Runde</Text>
      </PressableScale>
    </View>
  );
}

// Eine Zeile der Übersicht; aufgeklappt zeigt sie Bedeutung, Beispiele und den neuen Lernstand.
function ResultRow({ result, open, onToggle }: { result: RoundResult; open: boolean; onToggle: () => void }) {
  useTheme();
  const router = useRouter();
  const { lang } = useLanguage();
  const { card, reverse } = result.item;
  const { label, color, textColor, Icon } = RATINGS[result.rating];
  const turn = useAnimatedValue(open ? 1 : 0);

  useEffect(() => {
    Animated.timing(turn, { toValue: open ? 1 : 0, duration: 200, useNativeDriver: true }).start();
  }, [open, turn]);

  const rotate = turn.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const langLabel = LANGUAGES[lang].label;
  const change = SCORE_CHANGE[result.rating];
  const before = result.before?.score ?? 0;
  const pause = (result.after.dueRound ?? result.round) - result.round;

  return (
    <View style={[styles.row, open && styles.rowOpen]}>
      <Pressable
        style={styles.rowHead}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${card.lemma}, bewertet mit ${label}`}
      >
        <View style={[styles.ratingBubble, { backgroundColor: color }]}>
          <Icon color={textColor} size={16} />
        </View>
        <View style={styles.rowTexts}>
          <Text style={styles.rowLemma} numberOfLines={open ? undefined : 1}>
            {card.lemma}
          </Text>
          <Text style={styles.rowDe} numberOfLines={open ? undefined : 1}>
            {card.de}
          </Text>
        </View>
        {reverse && <ArrowLeftRight color={colors.muted} size={15} />}
        {card.level && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{card.level}</Text>
          </View>
        )}
        <Animated.View style={{ transform: [{ rotate }] }}>
          <ChevronDown color={colors.muted} size={20} />
        </Animated.View>
      </Pressable>

      {open && (
        <View style={styles.details}>
          <View style={styles.facts}>
            <Fact label="Gefragt" value={reverse ? `Deutsch → ${langLabel}` : `${langLabel} → Deutsch`} />
            <Fact label="Deine Wahl" value={`${label} (${change > 0 ? `+${change}` : change} Pkt.)`} />
            <Fact label="Wieder dran" value={pause <= 1 ? "nächste Runde" : `in ${pause} Runden`} />
          </View>

          <View style={styles.score}>
            <View style={styles.scoreHead}>
              <Text style={styles.scoreText}>
                Punkte {before} → {result.after.score} von {MASTERED_SCORE}
              </Text>
              <StatusPill status={getStatus(result.after)} />
            </View>
            <ProgressBar value={result.after.score / MASTERED_SCORE} />
          </View>

          {card.deAlt && card.deAlt.length > 0 && <Text style={styles.alt}>{card.deAlt.join(" · ")}</Text>}
          <WordMeta level={card.level} pos={card.pos} register={card.register} />
          {card.definitionEn && <Text style={styles.definition}>{card.definitionEn}</Text>}
          {card.examples.length > 0 && <ExampleList examples={card.examples.slice(0, 2)} accent={colors.accent} />}

          <View style={styles.actions}>
            <PressableScale style={styles.action} onPress={() => speak(card.lemma)} accessibilityRole="button">
              <Volume2 color={colors.accent} size={16} />
              <Text style={styles.actionText}>Anhören</Text>
            </PressableScale>
            <PressableScale style={styles.action} onPress={() => router.push(`/word/${card.id}`)} accessibilityRole="link">
              <ExternalLink color={colors.accent} size={16} />
              <Text style={styles.actionText}>Wortseite</Text>
            </PressableScale>
          </View>
        </View>
      )}
    </View>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  useTheme();
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = themed(() => ({
  screen: { flex: 1, gap: 12 },
  content: { gap: 14, paddingBottom: 8 },
  hero: { alignItems: "center", gap: 6, paddingVertical: 8 },
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 15, color: colors.muted, textAlign: "center" },
  tiles: { flexDirection: "row", gap: 10 },
  tilesStacked: { flexDirection: "column", gap: 8 },
  tileCell: { flex: 1 },
  tile: { borderRadius: 18, paddingVertical: 12, paddingHorizontal: 8, alignItems: "center", gap: 2 },
  tileStacked: { flexDirection: "row", justifyContent: "center", gap: 8 },
  tileDimmed: { opacity: 0.4 },
  tileValue: { fontSize: 24, fontWeight: "800" },
  tileLabel: { fontSize: 12, fontWeight: "600" },
  mastered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.success,
    borderRadius: 14,
    paddingVertical: 10,
  },
  masteredText: { fontSize: 14, fontWeight: "600", color: colors.onSuccess },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 10 },
  cardTitle: { fontSize: 13, fontWeight: "600", color: colors.muted, textTransform: "uppercase" },
  listHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  clear: { fontSize: 14, fontWeight: "600", color: colors.accent },
  list: { gap: 8 },
  row: { backgroundColor: colors.card, borderRadius: 18, overflow: "hidden" },
  rowOpen: { borderWidth: 1, borderColor: colors.border },
  rowHead: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  ratingBubble: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  rowTexts: { flex: 1, gap: 2 },
  rowLemma: { fontSize: 16, fontWeight: "600", color: colors.text },
  rowDe: { fontSize: 14, color: colors.muted },
  levelBadge: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2, backgroundColor: colors.background },
  levelText: { fontSize: 11, fontWeight: "700", color: colors.muted },
  details: { paddingHorizontal: 14, paddingBottom: 16, gap: 14 },
  facts: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  fact: { flexGrow: 1, backgroundColor: colors.background, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, gap: 2 },
  factLabel: { fontSize: 11, fontWeight: "600", color: colors.muted, textTransform: "uppercase" },
  factValue: { fontSize: 14, fontWeight: "600", color: colors.text },
  score: { gap: 8 },
  scoreHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  scoreText: { fontSize: 14, color: colors.text },
  alt: { fontSize: 14, color: colors.muted },
  definition: { fontSize: 15, lineHeight: 22, fontStyle: "italic", color: colors.text },
  actions: { flexDirection: "row", gap: 8 },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  actionText: { fontSize: 14, fontWeight: "600", color: colors.accent },
  startButton: { backgroundColor: colors.accent, borderRadius: 18, paddingVertical: 15, alignItems: "center" },
  startButtonText: { color: colors.onAccent, fontSize: 16, fontWeight: "600" },
}));
