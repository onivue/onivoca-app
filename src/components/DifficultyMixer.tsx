import { Gauge, Leaf, LucideIcon, Rocket, Scale, Shuffle, SlidersVertical } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { Animated, Pressable, View, useAnimatedValue } from "react-native";
import { Level } from "../data/cards";
import {
  DifficultyMix,
  FLOW_LOWER,
  FLOW_UPPER,
  LevelStat,
  LevelWeights,
  MAX_WEIGHT,
  PRESETS,
  countLevels,
  flowCenter,
  flowWeights,
  levelStats,
  presentLevels,
  presetWeights,
  resolveWeights,
} from "../lib/difficulty";
import { buildSession } from "../lib/srs";
import { useCards, useSentences } from "../state/cards";
import { useProgress } from "../state/progress";
import { colors } from "../theme/colors";
import { levelStyle } from "../theme/levels";
import { themed, useTheme } from "../theme/theme";
import { LevelBar } from "./LevelBar";
import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

const PRESET_ICONS = { gentle: Leaf, balanced: Scale, pro: Rocket } as const;

type ModeOption = { key: string; label: string; Icon: LucideIcon; bars?: LevelWeights; selected: boolean; next: DifficultyMix };

// Schwierigkeits-Mix in den Einstellungen: Vorlagen, Mischpult pro Stufe und adaptiver Flow-Modus.
export function DifficultyMixer() {
  useTheme();
  const { mix, setMix, progress, round, sessionSize } = useProgress();
  const words = useCards();
  const hasSentences = useSentences().length > 0;

  const counts = useMemo(() => countLevels(words), [words]);
  const levels = useMemo(() => presentLevels(counts), [counts]);
  const stats = useMemo(() => levelStats(words, progress), [words, progress]);
  const center = flowCenter(stats, levels);
  const current = resolveWeights(mix, words, progress) ?? mix.weights;
  // Vorschau: so sähe die nächste Runde mit dem gewählten Mix aus.
  const preview = useMemo(
    () =>
      countLevels(
        buildSession(words, progress, round + 1, sessionSize, resolveWeights(mix, words, progress)).map((i) => i.card),
      ),
    [words, progress, round, sessionSize, mix],
  );

  if (levels.length < 2) return null; // Ohne mehrere Stufen gibt es nichts zu mischen.

  const options: ModeOption[] = [
    { key: "off", label: "Frei", Icon: Shuffle, selected: mix.mode === "off", next: { ...mix, mode: "off" } },
    ...PRESETS.map((p) => ({
      key: p.id,
      label: p.label,
      Icon: PRESET_ICONS[p.id],
      bars: presetWeights(p.id, levels),
      selected: mix.mode === "preset" && mix.preset === p.id,
      next: { ...mix, mode: "preset" as const, preset: p.id },
    })),
    { key: "flow", label: "Flow", Icon: Gauge, selected: mix.mode === "flow", next: { ...mix, mode: "flow" } },
    {
      key: "custom",
      label: "Eigener",
      Icon: SlidersVertical,
      bars: mix.weights,
      selected: mix.mode === "custom",
      next: { ...mix, mode: "custom" },
    },
  ];

  // Tippen auf einen Balken setzt das Gewicht; nochmal auf den obersten tippen nimmt einen weg.
  // Von einer Vorlage aus geht es mit deren Werten in den eigenen Mix. Eine Stufe muss Gewicht behalten.
  function setWeight(level: Level, value: number) {
    const base = mix.mode === "custom" ? mix.weights : { ...mix.weights, ...roundWeights(current, levels) };
    const next = { ...base, [level]: value === base[level] ? value - 1 : value };
    if (levels.every((l) => next[l] === 0)) return;
    setMix({ ...mix, mode: "custom", weights: next });
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>
        Bestimme, wie viele Wörter welcher Stufe in eine Runde kommen – oder lass „Flow“ den Mix an deine Trefferquote anpassen.
      </Text>

      <View style={styles.modes}>
        {options.map((option) => (
          <PressableScale
            key={option.key}
            style={[styles.mode, option.selected && styles.modeSelected]}
            onPress={() => setMix(option.next)}
            accessibilityRole="button"
            accessibilityState={{ selected: option.selected }}
          >
            <option.Icon color={option.selected ? colors.onAccent : colors.accent} size={20} />
            <Text style={[styles.modeLabel, option.selected && styles.modeLabelSelected]}>{option.label}</Text>
            {option.bars && <MiniBars weights={option.bars} levels={levels} selected={option.selected} />}
          </PressableScale>
        ))}
      </View>

      {mix.mode === "off" && (
        <Text style={styles.hint}>Ohne Mix kommen die Karten nur nach Lernstand – egal, welche Stufe sie haben.</Text>
      )}

      {(mix.mode === "preset" || mix.mode === "custom") && (
        <>
          <Text style={styles.subTitle}>
            {mix.mode === "preset" ? `Vorlage „${PRESETS.find((p) => p.id === mix.preset)?.label}“` : "Eigener Mix"} · tippe auf die
            Balken
          </Text>
          <Equalizer weights={current} levels={levels} counts={counts} onSet={setWeight} />
        </>
      )}

      {mix.mode === "flow" && <FlowPanel center={center} stats={stats} levels={levels} counts={counts} />}

      <View style={styles.preview}>
        <Text style={styles.subTitle}>Nächste Runde</Text>
        <LevelBar counts={preview} />
      </View>

      <Text style={styles.small}>
        Reichen die Karten einer Stufe nicht, wird mit anderen aufgefüllt. Änderungen gelten ab der nächsten Runde.
        {hasSentences ? " Der Mix gilt für Wörter – Sätze haben keine Stufe." : ""}
      </Text>
    </View>
  );
}

function roundWeights(weights: LevelWeights, levels: Level[]) {
  return Object.fromEntries(levels.map((l) => [l, Math.round(weights[l])])) as Partial<LevelWeights>;
}

// Kleine Balken auf den Kacheln: zeigen die Verteilung auf einen Blick.
function MiniBars({ weights, levels, selected }: { weights: LevelWeights; levels: Level[]; selected: boolean }) {
  useTheme();
  return (
    <View style={styles.miniBars}>
      {levels.map((l) => (
        <View
          key={l}
          style={[
            styles.miniBar,
            {
              height: 3 + (weights[l] / MAX_WEIGHT) * 15,
              backgroundColor: selected ? colors.onAccent : levelStyle(l).strong,
              opacity: weights[l] === 0 ? 0.25 : 1,
            },
          ]}
        />
      ))}
    </View>
  );
}

// Mischpult: pro Stufe eine Säule mit fünf Balken. Ohne onSet nur zur Anzeige (Flow).
function Equalizer({
  weights,
  levels,
  counts,
  onSet,
}: {
  weights: LevelWeights;
  levels: Level[];
  counts: LevelWeights;
  onSet?: (level: Level, value: number) => void;
}) {
  useTheme();
  const total = levels.reduce((sum, l) => sum + weights[l], 0);

  return (
    <View style={styles.eq}>
      {levels.map((l) => {
        const { color, strong } = levelStyle(l);
        const filled = Math.round(weights[l]);
        const percent = total > 0 ? Math.round((weights[l] / total) * 100) : 0;
        return (
          <View key={l} style={[styles.eqColumn, { backgroundColor: color }]}>
            <Text style={[styles.eqLabel, { color: strong }]}>{l}</Text>
            <View style={styles.eqBars}>
              {Array.from({ length: MAX_WEIGHT }, (_, i) => MAX_WEIGHT - i).map((value) => (
                <Pressable
                  key={value}
                  disabled={!onSet}
                  onPress={() => onSet?.(l, value)}
                  hitSlop={{ top: 2, bottom: 2, left: 4, right: 4 }}
                  accessibilityRole="button"
                  accessibilityLabel={`${l}: Stärke ${value} von ${MAX_WEIGHT}`}
                  style={[styles.eqBar, { backgroundColor: value <= filled ? strong : colors.overlay }]}
                />
              ))}
            </View>
            <Text style={[styles.eqPercent, { color: strong }]} numberOfLines={1} adjustsFontSizeToFit>
              {percent}%
            </Text>
            <Text style={[styles.eqCount, { color: strong }]} numberOfLines={1}>
              {counts[l]} Wörter
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// Flow: Zeiger zeigt den aktuellen Schwerpunkt, darunter Trefferquoten und der daraus folgende Mix.
function FlowPanel({
  center,
  stats,
  levels,
  counts,
}: {
  center: number;
  stats: Record<Level, LevelStat>;
  levels: Level[];
  counts: LevelWeights;
}) {
  useTheme();
  // Der Zeiger steht über der Mitte der Zone seiner Stufe.
  const target = (center + 0.5) / levels.length;
  const position = useAnimatedValue(target);

  useEffect(() => {
    // "left" lässt sich nicht nativ animieren, daher useNativeDriver: false.
    Animated.spring(position, { toValue: target, friction: 7, useNativeDriver: false }).start();
  }, [target, position]);

  const focus = levels[Math.round(center)];
  const left = position.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <View style={styles.flow}>
      <Text style={styles.subTitle}>
        Schwerpunkt gerade: <Text style={[styles.subTitle, { color: levelStyle(focus).strong }]}>{focus}</Text>
      </Text>
      <View style={styles.gauge}>
        <View style={styles.gaugeTrack}>
          {levels.map((l) => (
            <View key={l} style={[styles.gaugeZone, { backgroundColor: levelStyle(l).color }]} />
          ))}
        </View>
        <Animated.View style={[styles.gaugeMarker, { left }]}>
          <View style={styles.gaugeKnob} />
        </Animated.View>
      </View>

      <View style={styles.rates}>
        {levels.map((l) => {
          const { hitRate, ratings } = stats[l];
          return (
            <View key={l} style={styles.rate}>
              <Text style={[styles.rateValue, { color: levelStyle(l).strong }]} numberOfLines={1} adjustsFontSizeToFit>
                {hitRate === null ? "–" : `${Math.round(hitRate * 100)}%`}
              </Text>
              <Text style={styles.rateLabel}>{l}</Text>
              <Text style={styles.rateCount} numberOfLines={1}>
                {ratings === 0 ? "neu" : `${ratings}×`}
              </Text>
            </View>
          );
        })}
      </View>

      <Equalizer weights={flowWeights(center, levels)} levels={levels} counts={counts} />

      <Text style={styles.small}>
        Flow schaut auf deine letzten Bewertungen pro Stufe. Weißt du eine Stufe zu über {Math.round(FLOW_UPPER * 100)} %, rückt der
        Schwerpunkt zur nächsten. Klappt die Stufe im Schwerpunkt unter {Math.round(FLOW_LOWER * 100)} %, rückt er wieder ein Stück
        zurück. Die Nachbarstufen sind immer mit dabei.
      </Text>
    </View>
  );
}

const styles = themed(() => ({
  wrap: { gap: 16 },
  hint: { fontSize: 14, lineHeight: 20, color: colors.muted },
  small: { fontSize: 13, lineHeight: 19, color: colors.muted },
  subTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  modes: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  mode: {
    flexGrow: 1,
    flexBasis: "30%",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  modeSelected: { backgroundColor: colors.accent },
  modeLabel: { fontSize: 14, fontWeight: "600", color: colors.text },
  modeLabelSelected: { color: colors.onAccent },
  miniBars: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: 18 },
  miniBar: { width: 5, borderRadius: 2 },
  eq: { flexDirection: "row", gap: 6 },
  eqColumn: { flex: 1, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 6, alignItems: "center", gap: 8 },
  eqLabel: { fontSize: 16, fontWeight: "800" },
  eqBars: { alignSelf: "stretch", gap: 5 },
  eqBar: { height: 16, borderRadius: 5 },
  eqPercent: { fontSize: 16, fontWeight: "800" },
  eqCount: { fontSize: 10, fontWeight: "500" },
  flow: { gap: 14 },
  gauge: { height: 28, justifyContent: "center" },
  gaugeTrack: { flexDirection: "row", height: 12, borderRadius: 6, overflow: "hidden", gap: 2 },
  gaugeZone: { flex: 1 },
  gaugeMarker: { position: "absolute", width: 0, alignItems: "center" },
  gaugeKnob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.text, borderWidth: 4, borderColor: colors.card },
  rates: { flexDirection: "row", gap: 6 },
  rate: { flex: 1, alignItems: "center", gap: 1 },
  rateValue: { fontSize: 17, fontWeight: "800" },
  rateLabel: { fontSize: 13, fontWeight: "600", color: colors.text },
  rateCount: { fontSize: 11, color: colors.muted },
  preview: { gap: 10, backgroundColor: colors.background, borderRadius: 18, padding: 14 },
}));
