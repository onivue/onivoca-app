import { useRouter } from "expo-router";
import { Check, ChevronRight, Search, SlidersHorizontal, Volume2, X } from "lucide-react-native";
import { memo, useDeferredValue, useMemo, useState } from "react";
import { Animated, Easing, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Screen } from "../../components/Screen";
import { RowsSkeleton } from "../../components/Skeleton";
import { StatusPill } from "../../components/StatusPill";
import { Text } from "../../components/Text";
import { CLUSTER_LABELS, LANGUAGES, LEVELS, Level, TOPICS, TopicId, WordEntry } from "../../data/cards";
import { speak } from "../../lib/speak";
import { Status, getStatus } from "../../lib/srs";
import { useCards, useSentences } from "../../state/cards";
import { useLanguage } from "../../state/language";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";
import { themed, useTheme } from "../../theme/theme";

type Filter = "word" | "sentence";
type SortMode = "asc" | "desc";
type StatusFilter = Status | "all";
type Option<T extends string> = { id: T | "all"; label: string };

// Auswahl als Chips; "all" hebt den Filter auf.
function ChipGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T | "all";
  onChange: (id: T | "all") => void;
}) {
  useTheme();
  return (
    <View style={styles.optionChips}>
      {options.map(({ id, label }) => (
        <Pressable key={id} style={[styles.chip, value === id && styles.chipActive]} onPress={() => onChange(id)}>
          <Text style={[styles.chipText, value === id && styles.chipTextActive]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
const SORTS: { id: SortMode; label: string }[] = [
  { id: "asc", label: "A–Z" },
  { id: "desc", label: "Z–A" },
];
const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Alle" },
  { id: "new", label: "Neu" },
  { id: "learning", label: "Am Lernen" },
  { id: "mastered", label: "Gelernt" },
];
const PAGE_SIZE = 100; // Sätze gibt es tausende, daher schrittweise anzeigen
const FILTERS: { id: Filter; label: string }[] = [
  { id: "word", label: "Wörter" },
  { id: "sentence", label: "Sätze" },
];

// Memoisiert, damit unveränderte Zeilen beim Filtern nicht neu rendern.
const WordRow = memo(function WordRow({ card, status }: { card: WordEntry; status: Status }) {
  useTheme();
  const router = useRouter();
  return (
    <Pressable style={styles.row} onPress={() => router.push(`/word/${card.id}`)}>
      <View style={[styles.dot, { backgroundColor: TOPICS[card.topics[0] ?? "daily"].color }]} />
      <View style={styles.texts}>
        <Text style={styles.front}>{card.lemma}</Text>
        <Text style={styles.back}>{card.de}</Text>
      </View>
      {card.level && (
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{card.level}</Text>
        </View>
      )}
      <StatusPill status={status} />
      <Pressable onPress={() => speak(card.lemma)} hitSlop={10}>
        <Volume2 color={colors.muted} size={20} />
      </Pressable>
      <ChevronRight color={colors.border} size={20} />
    </Pressable>
  );
});

// Tab 2: Liste der Karten mit Suche, Filter und A–Z-Sortierung. Tippen öffnet die Details.
export default function WordsScreen() {
  const { lang } = useLanguage();
  // Beim Sprachwechsel passen Filter und Suche nicht mehr, daher neu starten.
  return <WordsList key={lang} />;
}

function WordsList() {
  useTheme();
  const { progress } = useProgress();
  const wordCards = useCards();
  const sentenceCards = useSentences();
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("word");
  const [sortMode, setSortMode] = useState<SortMode>("asc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [topicFilter, setTopicFilter] = useState<TopicId | "all">("all");
  const [clusterFilter, setClusterFilter] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetAnim] = useState(() => new Animated.Value(0));

  const openSheet = () => {
    setSheetOpen(true);
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };
  // Modal erst nach der Ausblend-Animation unmounten.
  const closeSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setSheetOpen(false));
  };
  const activeCount =
    [statusFilter, levelFilter, topicFilter, clusterFilter].filter((f) => f !== "all").length +
    (sortMode !== "asc" ? 1 : 0);

  const levelOptions: Option<Level>[] = [{ id: "all", label: "Alle" }, ...LEVELS.filter((l) => wordCards.some((c) => c.level === l)).map((l) => ({ id: l, label: l }))];
  const topicOptions: Option<TopicId>[] = [
    { id: "all", label: "Alle" },
    ...(Object.keys(TOPICS) as TopicId[]).map((t) => ({ id: t, label: TOPICS[t].label })),
  ];
  const clusterOptions: Option<string>[] = useMemo(() => {
    const ids = [...new Set(wordCards.flatMap((c) => c.clusters))];
    return [{ id: "all", label: "Alle" }, ...ids.map((id) => ({ id, label: CLUSTER_LABELS[id] ?? id }))];
  }, [wordCards]);

  const criteria = useMemo(
    () => ({ query, filter, sortMode, statusFilter, levelFilter, topicFilter, clusterFilter }),
    [query, filter, sortMode, statusFilter, levelFilter, topicFilter, clusterFilter],
  );
  // Die schwere Liste rendert im Hintergrund; bis dahin zeigt die UI Skeleton-Zeilen.
  const deferred = useDeferredValue(criteria);
  const pending = deferred !== criteria;

  // Sucht in der Lernsprache und Deutsch sowie in Alternativen, Definition und Wortverbindungen.
  const cards = useMemo(() => {
    const search = deferred.query.trim().toLowerCase();
    const matches = (c: WordEntry) =>
      [c.lemma, c.de, ...(c.deAlt ?? []), c.definitionEn ?? "", ...(c.usage?.collocations ?? [])].some((text) =>
        text.toLowerCase().includes(search),
      );
    const result = (deferred.filter === "sentence" ? sentenceCards : wordCards)
            .filter(matches)
      .filter((c) => deferred.levelFilter === "all" || c.level === deferred.levelFilter)
      .filter((c) => deferred.topicFilter === "all" || c.topics.includes(deferred.topicFilter))
      .filter((c) => deferred.clusterFilter === "all" || c.clusters.includes(deferred.clusterFilter))
      .filter((c) => deferred.statusFilter === "all" || getStatus(progress[c.id]) === deferred.statusFilter);
    const dir = deferred.sortMode === "asc" ? 1 : -1;
    return result.sort((a, b) => a.lemma.localeCompare(b.lemma, LANGUAGES[lang].sort) * dir);
  }, [wordCards, sentenceCards, progress, deferred, lang]);

  return (
    <Screen title="Wörter">
      <View style={styles.search}>
        <Search color={colors.muted} size={20} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setLimit(PAGE_SIZE);
          }}
          placeholder={`${LANGUAGES[lang].label} oder Deutsch suchen`}
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={10}>
            <X color={colors.muted} size={20} />
          </Pressable>
        )}
      </View>

      <View style={styles.filters}>
        {FILTERS.map(({ id, label }) => (
          <Pressable
            key={id}
            style={[styles.chip, filter === id && styles.chipActive]}
            onPress={() => {
              setFilter(id);
              setLimit(PAGE_SIZE);
            }}
          >
            <Text style={[styles.chipText, filter === id && styles.chipTextActive]}>{label}</Text>
          </Pressable>
        ))}
        <Pressable
          style={[styles.chip, styles.sortChip, activeCount > 0 && styles.chipActive]}
          onPress={openSheet}
        >
          <SlidersHorizontal color={activeCount > 0 ? colors.onAccent : colors.text} size={18} />
          <Text style={[styles.chipText, activeCount > 0 && styles.chipTextActive]}>
            {activeCount > 0 ? `Filter · ${activeCount}` : "Filter"}
          </Text>
        </Pressable>
      </View>

      <Modal visible={sheetOpen} transparent animationType="none" onRequestClose={closeSheet}>
        <View style={styles.overlay}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: sheetAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) }] },
          ]}
        >
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Sortieren & filtern</Text>
            <Pressable onPress={closeSheet} hitSlop={10}>
              <X color={colors.muted} size={22} />
            </Pressable>
          </View>

          <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.sheetLabel}>Sortierung</Text>
            {SORTS.map(({ id, label }) => (
              <Pressable key={id} style={styles.option} onPress={() => setSortMode(id)}>
                <Text style={styles.optionText}>{label}</Text>
                {sortMode === id && <Check color={colors.accent} size={20} />}
              </Pressable>
            ))}

            <Text style={styles.sheetLabel}>Status</Text>
            <ChipGroup options={STATUS_FILTERS} value={statusFilter} onChange={(id) => setStatusFilter(id as StatusFilter)} />

            <Text style={styles.sheetLabel}>Niveau</Text>
            <ChipGroup options={levelOptions} value={levelFilter} onChange={setLevelFilter} />

            <Text style={styles.sheetLabel}>Thema</Text>
            <ChipGroup options={topicOptions} value={topicFilter} onChange={setTopicFilter} />

            <Text style={styles.sheetLabel}>Lerngruppe</Text>
            <ChipGroup options={clusterOptions} value={clusterFilter} onChange={setClusterFilter} />
          </ScrollView>

          <View style={styles.sheetActions}>
            <Pressable
              style={[styles.chip, styles.sheetButton]}
              onPress={() => {
                setSortMode("asc");
                setStatusFilter("all");
                setLevelFilter("all");
                setTopicFilter("all");
                setClusterFilter("all");
              }}
            >
              <Text style={styles.chipText}>Zurücksetzen</Text>
            </Pressable>
            <Pressable style={[styles.chip, styles.chipActive, styles.sheetButton]} onPress={closeSheet}>
              <Text style={[styles.chipText, styles.chipTextActive]}>{cards.length} anzeigen</Text>
            </Pressable>
          </View>
        </Animated.View>
        </View>
      </Modal>

      {!pending && cards.length === 0 && <Text style={styles.empty}>Nichts gefunden.</Text>}
      {pending ? (
        <RowsSkeleton />
      ) : (
        <View style={styles.list}>
          {cards.slice(0, limit).map((card) => (
            <WordRow key={card.id} card={card} status={getStatus(progress[card.id])} />
          ))}
          {cards.length > limit && (
            <Pressable style={styles.more} onPress={() => setLimit(limit + PAGE_SIZE)}>
              <Text style={styles.moreText}>Mehr anzeigen ({cards.length - limit} weitere)</Text>
            </Pressable>
          )}
        </View>
      )}
    </Screen>
  );
}

const styles = themed(() => ({
  more: { alignItems: "center", paddingVertical: 14 },
  moreText: { color: colors.accent, fontSize: 15, fontWeight: "600" },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 16, color: colors.text, fontFamily: "SpaceGrotesk_400Regular" },
  empty: { fontSize: 16, color: colors.muted, textAlign: "center", paddingVertical: 24 },
  filters: { flexDirection: "row", gap: 8 },
  chip: { backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  chipActive: { backgroundColor: colors.accent },
  sortChip: { flexDirection: "row", alignItems: "center", gap: 6, marginLeft: "auto" },
  chipText: { fontSize: 15, fontWeight: "500", color: colors.text },
  chipTextActive: { color: colors.onAccent },
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { backgroundColor: colors.backdrop },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sheetTitle: { fontSize: 20, fontWeight: "700", color: colors.text },
  sheetLabel: { fontSize: 13, fontWeight: "600", color: colors.muted, marginTop: 18, textTransform: "uppercase" },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionText: { fontSize: 16, color: colors.text },
  sheetActions: { flexDirection: "row", gap: 10, marginTop: 24 },
  sheetScroll: { maxHeight: 440 },
  optionChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  levelBadge: { backgroundColor: colors.text, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  levelText: { fontSize: 11, fontWeight: "600", color: colors.onText },
  sheetButton: { flex: 1, alignItems: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  list: { backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
  texts: { flex: 1 },
  front: { fontSize: 17, fontWeight: "600", color: colors.text },
  back: { fontSize: 14, color: colors.muted },
}));
