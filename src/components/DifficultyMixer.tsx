import { Check, Gauge, Leaf, LucideIcon, Rocket, Scale, Shuffle, SlidersVertical } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { Animated, LayoutAnimation, Pressable, View, useAnimatedValue } from "react-native";
import { Level } from "../data/cards";
import {
  DifficultyMix,
  FLOW_UPPER,
  LevelStat,
  LevelWeights,
  MAX_WEIGHT,
  PRESETS,
  PresetId,
  countLevels,
  flowCenter,
  flowWeights,
  levelStats,
  presentLevels,
  presetWeights,
  resolveWeights,
} from "../lib/difficulty";
import { buildSession } from "../lib/srs";
import { useCards } from "../state/cards";
import { useProgress } from "../state/progress";
import { colors } from "../theme/colors";
import { levelStyle } from "../theme/levels";
import { themed, useTheme } from "../theme/theme";
import { LevelBar } from "./LevelBar";
import { Text } from "./Text";

type ModeKey = "flow" | PresetId | "custom" | "off";

const MODES: { key: ModeKey; title: string; description: string; Icon: LucideIcon; recommended?: boolean }[] = [
  { key: "flow", title: "Flow", description: "Passt sich laufend deiner Trefferquote an", Icon: Gauge, recommended: true },
  { key: "gentle", title: "Sanft", description: "Vor allem leichte Wörter, ideal zum Einstieg", Icon: Leaf },
  { key: "balanced", title: "Ausgewogen", description: "Von jeder Stufe gleich viel", Icon: Scale },
  { key: "pro", title: "Profi", description: "Vor allem schwere Wörter", Icon: Rocket },
  { key: "custom", title: "Eigener Mix", description: "Stufe für Stufe selbst einstellen", Icon: SlidersVertical },
  { key: "off", title: "Frei", description: "Kein Mix, nur nach Lernstand", Icon: Shuffle },
];

function modeKey(mix: DifficultyMix): ModeKey {
  return mix.mode === "preset" ? mix.preset : mix.mode;
}

function mixFor(key: ModeKey, mix: DifficultyMix): DifficultyMix {
  if (key === "flow" || key === "custom" || key === "off") return { ...mix, mode: key };
  return { ...mix, mode: "preset", preset: key };
}

// Gemeinsame Daten für Auswahl, Vorschau und die Zeile in den Einstellungen.
export function useMixData() {
  const { mix, progress } = useProgress();
  const words = useCards();
  const counts = useMemo(() => countLevels(words), [words]);
  const levels = useMemo(() => presentLevels(counts), [counts]);
  const stats = useMemo(() => levelStats(words, progress), [words, progress]);
  const center = flowCenter(stats, levels);
  return { mix, counts, levels, stats, center };
}

// Kurzbeschreibung des gewählten Mix, z. B. "Flow · B2".
export function useMixLabel() {
  const { mix, levels, center } = useMixData();
  if (mix.mode === "flow") return levels.length ? `Flow · ${levels[Math.round(center)]}` : "Flow";
  if (mix.mode === "preset") return PRESETS.find((p) => p.id === mix.preset)?.label ?? "Vorlage";
  return mix.mode === "custom" ? "Eigener Mix" : "Frei";
}

// Vorschau: so verteilt sich die nächste Runde auf die Stufen.
export function MixPreview() {
  useTheme();
  const { mix, progress, round, sessionSize } = useProgress();
  const words = useCards();
  const preview = useMemo(
    () =>
      countLevels(
        buildSession(words, progress, round + 1, sessionSize, resolveWeights(mix, words, progress)).map((i) => i.card),
      ),
    [words, progress, round, sessionSize, mix],
  );
  const total = Object.values(preview).reduce((sum, n) => sum + n, 0);

  return (
    <View style={styles.preview}>
      <View style={styles.previewHead}>
        <Text style={styles.previewTitle}>Deine nächste Runde</Text>
        <Text style={styles.previewCount}>{total} Wörter</Text>
      </View>
      <LevelBar counts={preview} />
    </View>
  );
}

// Auswahl des Mix als Liste. Ausführlich klappt die gewählte Option ihre Einstellungen auf;
// kompakt (Anleitung) gibt es nur Flow, die Vorlagen und Frei.
export function MixModeList({ compact = false }: { compact?: boolean }) {
  useTheme();
  const { setMix } = useProgress();
  const { mix, counts, levels, stats, center } = useMixData();
  const active = modeKey(mix);

  if (levels.length < 2) return null; // Ohne mehrere Stufen gibt es nichts zu mischen.

  const modes = compact ? MODES.filter((m) => m.key !== "custom") : MODES;

  function barsFor(key: ModeKey): LevelWeights | null {
    if (key === "flow") return flowWeights(center, levels);
    if (key === "custom") return mix.weights;
    if (key === "off") return null;
    return presetWeights(key, levels);
  }

  function choose(key: ModeKey) {
    if (key === active) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMix(mixFor(key, mix));
  }

  // Tippen auf ein Segment setzt das Gewicht; nochmal auf das oberste tippen nimmt eins weg.
  // Mindestens eine Stufe muss Gewicht behalten.
  function setWeight(level: Level, value: number) {
    const next = { ...mix.weights, [level]: value === mix.weights[level] ? value - 1 : value };
    if (levels.every((l) => next[l] === 0)) return;
    setMix({ ...mix, mode: "custom", weights: next });
  }

  return (
    <View style={styles.list}>
      {modes.map(({ key, title, description, Icon, recommended }) => {
        const selected = key === active;
        const bars = barsFor(key);
        return (
          <View key={key} style={[styles.option, selected && styles.optionSelected]}>
            <Pressable
              style={styles.optionHead}
              onPress={() => choose(key)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${title}: ${description}`}
            >
              <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
                <Icon color={selected ? colors.onAccent : colors.accent} size={20} />
              </View>
              <View style={styles.optionTexts}>
                <View style={styles.optionTitleRow}>
                  <Text style={styles.optionTitle}>{title}</Text>
                  {recommended && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Empfohlen</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.optionText}>{description}</Text>
              </View>
              {bars && <MiniBars weights={bars} levels={levels} />}
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <Check color={colors.onAccent} size={14} strokeWidth={3} />}
              </View>
            </Pressable>

            {!compact && selected && key === "flow" && <FlowView center={center} stats={stats} levels={levels} />}
            {!compact && selected && key === "custom" && (
              <Equalizer weights={mix.weights} levels={levels} counts={counts} onSet={setWeight} />
            )}
          </View>
        );
      })}
    </View>
  );
}

// Kleine Balken: zeigen die Verteilung einer Option auf einen Blick.
function MiniBars({ weights, levels }: { weights: LevelWeights; levels: Level[] }) {
  useTheme();
  const max = Math.max(...levels.map((l) => weights[l]), 1);
  return (
    <View style={styles.miniBars}>
      {levels.map((l) => (
        <View
          key={l}
          style={[
            styles.miniBar,
            {
              height: 3 + (weights[l] / max) * 17,
              backgroundColor: levelStyle(l).strong,
              opacity: weights[l] < 0.5 ? 0.25 : 1,
            },
          ]}
        />
      ))}
    </View>
  );
}

// Mischpult: pro Stufe eine Säule aus fünf Segmenten zum Antippen.
function Equalizer({
  weights,
  levels,
  counts,
  onSet,
}: {
  weights: LevelWeights;
  levels: Level[];
  counts: LevelWeights;
  onSet: (level: Level, value: number) => void;
}) {
  useTheme();
  const total = levels.reduce((sum, l) => sum + weights[l], 0);

  return (
    <View style={styles.panel}>
      <View style={styles.eq}>
        {levels.map((l) => {
          const { color, strong } = levelStyle(l);
          const percent = total > 0 ? Math.round((weights[l] / total) * 100) : 0;
          return (
            <View key={l} style={styles.eqColumn}>
              <Text style={[styles.eqPercent, weights[l] === 0 && styles.eqMuted]} numberOfLines={1} adjustsFontSizeToFit>
                {percent}%
              </Text>
              <View style={styles.eqTrack}>
                {Array.from({ length: MAX_WEIGHT }, (_, i) => MAX_WEIGHT - i).map((value) => (
                  <Pressable
                    key={value}
                    onPress={() => onSet(l, value)}
                    hitSlop={{ top: 2, bottom: 2, left: 6, right: 6 }}
                    accessibilityRole="button"
                    accessibilityLabel={`${l}: Stärke ${value} von ${MAX_WEIGHT}`}
                    style={[styles.eqSegment, { backgroundColor: value <= weights[l] ? strong : color }]}
                  />
                ))}
              </View>
              <Text style={[styles.eqLevel, { color: strong }]}>{l}</Text>
              <Text style={styles.eqCount} numberOfLines={1}>
                {counts[l]}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.panelHint}>Tippe auf die Segmente. Nochmal tippen nimmt eins weg. Die Zahl unten ist die Anzahl Wörter.</Text>
    </View>
  );
}

// Flow: Leiste mit den Stufen, Zeiger auf dem Schwerpunkt und Trefferquote pro Stufe.
function FlowView({ center, stats, levels }: { center: number; stats: Record<Level, LevelStat>; levels: Level[] }) {
  useTheme();
  // Der Zeiger steht über der Mitte der Zone seiner Stufe.
  const target = (center + 0.5) / levels.length;
  const position = useAnimatedValue(target);

  useEffect(() => {
    // "left" lässt sich nicht nativ animieren, daher useNativeDriver: false.
    Animated.spring(position, { toValue: target, friction: 7, useNativeDriver: false }).start();
  }, [target, position]);

  const left = position.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const focus = levels[Math.round(center)];

  return (
    <View style={styles.panel}>
      <View style={styles.flowBox}>
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
        <View style={styles.zones}>
          {levels.map((l) => {
            const { hitRate } = stats[l];
            return (
              <View key={l} style={styles.zone}>
                <Text style={[styles.zoneLevel, { color: levelStyle(l).strong }, l === focus && styles.zoneFocus]}>{l}</Text>
                <Text style={styles.zoneRate} numberOfLines={1}>
                  {hitRate === null ? "neu" : `${Math.round(hitRate * 100)}%`}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      <Text style={styles.panelHint}>
        Schwerpunkt gerade bei {focus}. Weißt du eine Stufe zu über {Math.round(FLOW_UPPER * 100)} %, rückt er weiter nach oben; klappt
        es nicht, wieder zurück. Darunter: deine Trefferquote pro Stufe.
      </Text>
    </View>
  );
}

const styles = themed(() => ({
  preview: { gap: 12, backgroundColor: colors.card, borderRadius: 24, padding: 18 },
  previewHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  previewTitle: { fontSize: 17, fontWeight: "700", color: colors.text },
  previewCount: { fontSize: 14, color: colors.muted },
  list: { gap: 10 },
  option: { backgroundColor: colors.card, borderRadius: 20, borderWidth: 2, borderColor: "transparent", overflow: "hidden" },
  optionSelected: { borderColor: colors.accent },
  optionHead: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  optionIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  optionIconSelected: { backgroundColor: colors.accent },
  optionTexts: { flex: 1, gap: 2 },
  optionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  optionTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  optionText: { fontSize: 13, lineHeight: 18, color: colors.muted },
  badge: { backgroundColor: colors.success, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: "700", color: colors.onSuccess },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  miniBars: { flexDirection: "row", alignItems: "flex-end", gap: 2, height: 20 },
  miniBar: { width: 4, borderRadius: 2 },
  panel: { paddingHorizontal: 14, paddingBottom: 16, gap: 10 },
  panelHint: { fontSize: 13, lineHeight: 18, color: colors.muted },
  eq: { flexDirection: "row", gap: 8, backgroundColor: colors.background, borderRadius: 16, padding: 12 },
  eqColumn: { flex: 1, alignItems: "center", gap: 6 },
  eqPercent: { fontSize: 14, fontWeight: "800", color: colors.text },
  eqMuted: { color: colors.muted },
  eqTrack: { alignSelf: "stretch", gap: 4 },
  eqSegment: { height: 18, borderRadius: 6 },
  eqLevel: { fontSize: 15, fontWeight: "800" },
  eqCount: { fontSize: 11, color: colors.muted },
  flowBox: { backgroundColor: colors.background, borderRadius: 16, padding: 12, gap: 8 },
  gauge: { height: 26, justifyContent: "center" },
  gaugeTrack: { flexDirection: "row", height: 12, borderRadius: 6, overflow: "hidden", gap: 2 },
  gaugeZone: { flex: 1 },
  gaugeMarker: { position: "absolute", width: 0, alignItems: "center" },
  gaugeKnob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.text, borderWidth: 4, borderColor: colors.background },
  zones: { flexDirection: "row" },
  zone: { flex: 1, alignItems: "center", gap: 1 },
  zoneLevel: { fontSize: 14, fontWeight: "700" },
  zoneFocus: { textDecorationLine: "underline" },
  zoneRate: { fontSize: 12, color: colors.muted },
}));
