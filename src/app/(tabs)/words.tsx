import { useRouter } from "expo-router";
import { Check, ChevronRight, Search, SlidersHorizontal, Volume2, X } from "lucide-react-native";
import { memo, useDeferredValue, useMemo, useState } from "react";
import { Animated, Easing, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Screen } from "../../components/Screen";
import { RowsSkeleton } from "../../components/Skeleton";
import { StatusPill } from "../../components/StatusPill";
import { Text } from "../../components/Text";
import { CATEGORIES, CardData } from "../../data/cards";
import { speak } from "../../lib/speak";
import { Status, getStatus } from "../../lib/srs";
import { useCards } from "../../state/cards";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";

type Filter = "word" | "phrase";
type SortMode = "asc" | "desc";
type StatusFilter = Status | "all";
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
const FILTERS: { id: Filter; label: string }[] = [
  { id: "word", label: "Wörter" },
  { id: "phrase", label: "Sätze" },
];

// Memoisiert, damit unveränderte Zeilen beim Filtern nicht neu rendern.
const WordRow = memo(function WordRow({ card, status }: { card: CardData; status: Status }) {
  const router = useRouter();
  return (
    <Pressable style={styles.row} onPress={() => router.push(`/word/${card.id}`)}>
      <View style={[styles.dot, { backgroundColor: CATEGORIES[card.category].color }]} />
      <View style={styles.texts}>
        <Text style={styles.front}>{card.front}</Text>
        <Text style={styles.back}>{card.back}</Text>
      </View>
      <StatusPill status={status} />
      <Pressable onPress={() => speak(card.front)} hitSlop={10}>
        <Volume2 color={colors.muted} size={20} />
      </Pressable>
      <ChevronRight color={colors.border} size={20} />
    </Pressable>
  );
});

// Tab 2: Liste der Karten mit Suche, Filter und A–Z-Sortierung. Tippen öffnet die Details.
export default function WordsScreen() {
  const { progress } = useProgress();
  const allCards = useCards();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("word");
  const [sortMode, setSortMode] = useState<SortMode>("asc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
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
  const activeCount = (statusFilter !== "all" ? 1 : 0) + (sortMode !== "asc" ? 1 : 0);

  const criteria = useMemo(
    () => ({ query, filter, sortMode, statusFilter }),
    [query, filter, sortMode, statusFilter],
  );
  // Die schwere Liste rendert im Hintergrund; bis dahin zeigt die UI Skeleton-Zeilen.
  const deferred = useDeferredValue(criteria);
  const pending = deferred !== criteria;

  // Sucht in Englisch und Deutsch, Groß-/Kleinschreibung egal.
  const cards = useMemo(() => {
    const search = deferred.query.trim().toLowerCase();
    const result = allCards
      .filter((c) => (c.category === "phrasen") === (deferred.filter === "phrase"))
      .filter((c) => c.front.toLowerCase().includes(search) || c.back.toLowerCase().includes(search))
      .filter((c) => deferred.statusFilter === "all" || getStatus(progress[c.id]) === deferred.statusFilter);
    const dir = deferred.sortMode === "asc" ? 1 : -1;
    return result.sort((a, b) => a.front.localeCompare(b.front, "en") * dir);
  }, [allCards, progress, deferred]);

  return (
    <Screen title="Wörter">
      <View style={styles.search}>
        <Search color={colors.muted} size={20} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Englisch oder Deutsch suchen"
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
            onPress={() => setFilter(id)}
          >
            <Text style={[styles.chipText, filter === id && styles.chipTextActive]}>{label}</Text>
          </Pressable>
        ))}
        <Pressable
          style={[styles.chip, styles.sortChip, activeCount > 0 && styles.chipActive]}
          onPress={openSheet}
        >
          <SlidersHorizontal color={activeCount > 0 ? "#fff" : colors.text} size={18} />
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

          <Text style={styles.sheetLabel}>Sortierung</Text>
          {SORTS.map(({ id, label }) => (
            <Pressable key={id} style={styles.option} onPress={() => setSortMode(id)}>
              <Text style={styles.optionText}>{label}</Text>
              {sortMode === id && <Check color={colors.accent} size={20} />}
            </Pressable>
          ))}

          <Text style={styles.sheetLabel}>Status</Text>
          {STATUS_FILTERS.map(({ id, label }) => (
            <Pressable key={id} style={styles.option} onPress={() => setStatusFilter(id)}>
              <Text style={styles.optionText}>{label}</Text>
              {statusFilter === id && <Check color={colors.accent} size={20} />}
            </Pressable>
          ))}

          <View style={styles.sheetActions}>
            <Pressable
              style={[styles.chip, styles.sheetButton]}
              onPress={() => {
                setSortMode("asc");
                setStatusFilter("all");
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
          {cards.map((card) => (
            <WordRow key={card.id} card={card} status={getStatus(progress[card.id])} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  chipTextActive: { color: "#fff" },
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { backgroundColor: "rgba(0,0,0,0.4)" },
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
});
