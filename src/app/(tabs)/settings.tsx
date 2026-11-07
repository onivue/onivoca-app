import { Link } from "expo-router";
import {
  Brain,
  CircleHelp,
  Languages,
  CalendarClock,
  ChevronDown,
  SlidersVertical,
  ChevronUp,
  Layers,
  Minus,
  Monitor,
  Moon,
  Sun,
  Timer,
  Plus,
  RefreshCcw,
  Repeat,
  Settings2,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  Trophy,
  FileText,
  Zap,
} from "lucide-react-native";
import { ReactNode, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { DifficultyMixer } from "../../components/DifficultyMixer";
import { PressableScale } from "../../components/PressableScale";
import { ProgressRing } from "../../components/ProgressRing";
import { Screen } from "../../components/Screen";
import { Text } from "../../components/Text";
import { EASY_DELAY, LEARNING_SLOTS, MASTERED_SCORE, SCORE_CHANGE, SESSION_SIZES, summarize } from "../../lib/srs";
import { LANGUAGES, LANG_ORDER } from "../../data/cards";
import { useCards, useSentences } from "../../state/cards";
import { useLanguage } from "../../state/language";
import { useOnboarding } from "../../state/onboarding";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";
import { themed, useTheme } from "../../theme/theme";

// Tab 3: Einstellungen (Sprache, Anleitung, Lernen, Design) mit Lernfortschritt und Erklärung des Algorithmus.
export default function SettingsScreen() {
  useTheme();
  const { progress, round, delays, sessionSize, setSessionSize, setDelay, reset } = useProgress();
  const { pref, setPref } = useTheme();
  const { lang, setLang, deck } = useLanguage();
  const { open: openGuide } = useOnboarding();
  const words = useCards();
  const sentences = useSentences();
  const showSentences = deck === "sentences" && sentences.length > 0;
  const cards = showSentences ? sentences : words;
  const summary = summarize(cards, progress);
  const [explainOpen, setExplainOpen] = useState(false);

  const total = Math.max(summary.total, 1);
  const reviews = Object.values(progress).reduce(
    (sum, p) => ({ again: sum.again + p.again, good: sum.good + p.good, easy: sum.easy + p.easy }),
    { again: 0, good: 0, easy: 0 },
  );
  const reviewCount = reviews.again + reviews.good + reviews.easy;
  const hitRate = reviewCount > 0 ? Math.round(((reviews.good + reviews.easy) / reviewCount) * 100) : 0;

  function confirmReset() {
    Alert.alert("Fortschritt zurücksetzen?", "Alle Karten beginnen wieder bei null.", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Zurücksetzen", style: "destructive", onPress: reset },
    ]);
  }

  return (
    <Screen title="Einstellungen">
      {/* Sprache und Anleitung */}
      <Section icon={<Languages color={colors.accent} size={20} />} title="Sprache">
        <Text style={styles.hint}>Welche Sprache du gerade lernst. Der Lernstand wird pro Sprache getrennt gespeichert.</Text>
        <Segmented
          options={LANG_ORDER.map((id) => ({ value: id, label: LANGUAGES[id].label }))}
          value={lang}
          onChange={setLang}
        />
        <PressableScale style={styles.guideButton} onPress={openGuide} accessibilityRole="button">
          <CircleHelp color={colors.accent} size={18} />
          <Text style={styles.guideText}>Anleitung ansehen</Text>
        </PressableScale>
      </Section>

      {/* Hero: Ring + gestapelter Balken */}
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <ProgressRing value={summary.mastered / total} color={colors.accent} label="gelernt" />
        <Text style={styles.heroText}>
          {summary.mastered} von {summary.total} {showSentences ? "Sätzen" : "Wörtern"} gelernt
        </Text>
        <View style={styles.stack}>
          <View style={[styles.stackPart, { flex: summary.mastered, backgroundColor: "#16A34A" }]} />
          <View style={[styles.stackPart, { flex: summary.learning, backgroundColor: "#F59E0B" }]} />
          <View style={[styles.stackPart, { flex: summary.new, backgroundColor: colors.overlay }]} />
        </View>
        <View style={styles.legend}>
          <Legend color="#16A34A" label="Gelernt" />
          <Legend color="#F59E0B" label="Am Lernen" />
          <Legend color="rgba(255,255,255,0.9)" label="Offen" />
        </View>
      </View>

      <View style={styles.tiles}>
        <Tile icon={<Sparkles color={colors.onPrimary} size={20} />} label="Offen" value={summary.new} color={colors.primary} fg={colors.onPrimary} />
        <Tile icon={<Brain color={colors.onWarning} size={20} />} label="Am Lernen" value={summary.learning} color={colors.warning} fg={colors.onWarning} />
        <Tile icon={<Trophy color={colors.onSuccess} size={20} />} label="Gelernt" value={summary.mastered} color={colors.success} fg={colors.onSuccess} />
      </View>

      <View style={styles.tiles}>
        <Tile icon={<Repeat color={colors.onOrange} size={20} />} label="Bewertungen" value={reviewCount} color={colors.orange} fg={colors.onOrange} />
        <Tile icon={<ThumbsUp color={colors.onSky} size={20} />} label="Trefferquote" value={`${hitRate}%`} color={colors.sky} fg={colors.onSky} />
        <Tile icon={<Layers color={colors.onPink} size={20} />} label="Runde" value={round + 1} color={colors.pink} fg={colors.onPink} />
      </View>

      {/* Algorithmus erklärt */}
      <View style={styles.explain}>
        <PressableScale style={styles.explainHeader} onPress={() => setExplainOpen((open) => !open)} accessibilityRole="button">
          <View style={styles.iconBubble}>
            <Zap color="#fff" size={20} />
          </View>
          <View style={styles.explainTitles}>
            <Text style={styles.sectionTitle}>So funktioniert das Lernen</Text>
            <Text style={styles.hint}>Punkte, Runden und Wiederholungen erklärt</Text>
          </View>
          {explainOpen ? <ChevronUp color={colors.muted} size={22} /> : <ChevronDown color={colors.muted} size={22} />}
        </PressableScale>

        {explainOpen && (
          <View style={styles.explainBody}>
            <Step n={1} title="Runden statt Termine">
              Es gibt keine Fristen. Jede Runde besteht aus bis zu {sessionSize} Karten. Du lernst so oft und so lange du willst – nach jeder
              Runde zählt der Rundenzähler hoch.
            </Step>
            <Step n={2} title="Du bewertest jede Karte">
              Nach dem Umdrehen sagst du ehrlich, wie gut du die Karte kanntest:
            </Step>
            <View style={styles.ratings}>
              <RatingInfo color={colors.danger} label="Nochmal" points={SCORE_CHANGE.again} detail={`kommt in ${delays.again === 1 ? "der nächsten" : delays.again} Runde${delays.again === 1 ? "" : "n"} wieder`} />
              <RatingInfo color={colors.warning} label="Gut" points={SCORE_CHANGE.good} detail={`kommt in ${delays.good} Runden wieder`} />
              <RatingInfo color={colors.success} label="Einfach" points={SCORE_CHANGE.easy} detail={`kommt in ${EASY_DELAY} Runden wieder`} />
            </View>
            <Step n={3} title={`Ab ${MASTERED_SCORE} Punkten ist sie gelernt`}>
              Jede Karte sammelt Punkte (mindestens 0, höchstens {MASTERED_SCORE}). „Nochmal“ kostet Punkte, damit Wackelkandidaten nicht
              zu früh als gelernt gelten.
            </Step>
            <Step n={4} title="Was in eine Runde kommt">
              Zuerst bis zu {LEARNING_SLOTS} Karten, die du gerade lernst (die schwächsten zuerst), dann neue Karten, danach weitere
              Lernkarten. Sind alle gelernt, gibt es eine Auffrischung mit zufälligen Karten. Karten, die noch „Pause“ haben, werden
              übersprungen. Mit dem Schwierigkeits-Mix wählst du zusätzlich, wie viele leichte, mittlere und schwere Wörter dabei sind.
            </Step>
            <Step n={5} title="Richtung wechselt">
              Bereits bekannte Karten werden in etwa der Hälfte der Fälle umgekehrt gefragt: Deutsch zeigen, die Lernsprache erraten.
            </Step>
            <Step n={6} title="Rückblick nach jeder Runde">
              Am Ende siehst du alle Karten der Runde mit deiner Bewertung. Tippe eine an, um Bedeutung, Beispiele und den neuen
              Punktestand zu sehen.
            </Step>
          </View>
        )}
      </View>

      {/* Rundenlänge */}
      <Section icon={<Timer color={colors.accent} size={20} />} title="Rundenlänge">
        <Text style={styles.hint}>
          So viele Karten gehören zu einer Runde. Die Änderung gilt ab der nächsten Runde.
        </Text>
        <Segmented
          options={SESSION_SIZES.map((size) => ({ value: size, label: String(size) }))}
          value={sessionSize}
          onChange={setSessionSize}
        />
      </Section>

      {/* Schwierigkeits-Mix */}
      <Section icon={<SlidersVertical color={colors.accent} size={20} />} title="Schwierigkeits-Mix">
        <DifficultyMixer />
      </Section>

      {/* Design */}
      <Section icon={<Moon color={colors.accent} size={20} />} title="Design">
        <Segmented
          options={[
            { value: "system" as const, label: "System", icon: <Monitor color={colors.text} size={16} /> },
            { value: "light" as const, label: "Hell", icon: <Sun color={colors.text} size={16} /> },
            { value: "dark" as const, label: "Dunkel", icon: <Moon color={colors.text} size={16} /> },
          ]}
          value={pref}
          onChange={setPref}
        />
      </Section>

      {/* Einstellungen */}
      <Section icon={<Settings2 color={colors.accent} size={20} />} title="Wiederholungsabstand">
        <Text style={styles.hint}>
          Lege fest, nach wie vielen Runden eine Karte frühestens wieder auftaucht. Kürzer = mehr Übung, länger = mehr Abwechslung.
        </Text>
        <DelayControl
          icon={<RefreshCcw color="#B91C1C" size={20} />}
          label="Nochmal"
          value={delays.again}
          min={1}
          max={3}
          color="#EF4444"
          onChange={(rounds) => setDelay("again", rounds)}
        />
        <DelayControl
          icon={<CalendarClock color="#B45309" size={20} />}
          label="Gut"
          value={delays.good}
          min={2}
          max={EASY_DELAY}
          color="#F59E0B"
          onChange={(rounds) => setDelay("good", rounds)}
        />
        <Text style={styles.hint}>„Einfach“ ist fest auf {EASY_DELAY} Runden gesetzt.</Text>
      </Section>

      <PressableScale style={styles.reset} onPress={confirmReset}>
        <Text style={styles.resetText}>Fortschritt zurücksetzen</Text>
      </PressableScale>

      <Link href="/privacy" asChild>
        <PressableScale style={styles.link} accessibilityRole="link">
          <ShieldCheck color={colors.muted} size={16} />
          <Text style={styles.linkText}>Datenschutzerklärung</Text>
        </PressableScale>
      </Link>
      <Link href="/licenses" asChild>
        <PressableScale style={styles.link} accessibilityRole="link">
          <FileText color={colors.muted} size={16} />
          <Text style={styles.linkText}>Drittanbieter-Lizenzen</Text>
        </PressableScale>
      </Link>
    </Screen>
  );
}

// Auswahl in einer Reihe: jede Option ist gleich breit, die gewählte ist hervorgehoben.
function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
}) {
  useTheme();
  return (
    <View style={styles.segmented}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            style={[styles.segment, selected && styles.segmentSelected]}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            {option.icon}
            <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  useTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  useTheme();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Tile({ icon, label, value, color, fg }: { icon: ReactNode; label: string; value: number | string; color: string; fg: string }) {
  useTheme();
  return (
    <View style={[styles.tile, { backgroundColor: color }]}>
      {icon}
      <Text style={[styles.tileValue, { color: fg }]}>{value}</Text>
      <Text style={[styles.tileLabel, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  useTheme();
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{n}</Text>
      </View>
      <View style={styles.stepBody}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepText}>{children}</Text>
      </View>
    </View>
  );
}

function RatingInfo({ color, label, points, detail }: { color: string; label: string; points: number; detail: string }) {
  useTheme();
  return (
    <View style={[styles.rating, { backgroundColor: color }]}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <Text style={styles.ratingPoints}>{points > 0 ? `+${points}` : points} Pkt.</Text>
      <Text style={styles.ratingDetail}>{detail}</Text>
    </View>
  );
}

// Stepper (− / +) plus Zeitstrahl: zeigt, in welcher Runde die Karte wieder auftaucht.
function DelayControl({
  icon,
  label,
  value,
  min,
  max,
  color,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  color: string;
  onChange: (rounds: number) => void;
}) {
  useTheme();
  return (
    <View style={styles.delayRow}>
      <View style={styles.delayHead}>
        {icon}
        <View style={styles.delayTitles}>
          <Text style={styles.delayLabel}>{label}</Text>
          <Text style={styles.delayValue}>{value === 1 ? "in der nächsten Runde" : `nach ${value} Runden`}</Text>
        </View>
        <View style={styles.stepper}>
          <PressableScale
            style={[styles.stepButton, value <= min && styles.stepButtonDisabled]}
            disabled={value <= min}
            onPress={() => onChange(value - 1)}
            accessibilityRole="button"
            accessibilityLabel={`${label}: eine Runde weniger`}
          >
            <Minus color={colors.text} size={18} />
          </PressableScale>
          <PressableScale
            style={[styles.stepButton, value >= max && styles.stepButtonDisabled]}
            disabled={value >= max}
            onPress={() => onChange(value + 1)}
            accessibilityRole="button"
            accessibilityLabel={`${label}: eine Runde mehr`}
          >
            <Plus color={colors.text} size={18} />
          </PressableScale>
        </View>
      </View>
      <View style={styles.timeline}>
        <View style={styles.timelineTrack} />
        <View style={[styles.timelineFill, { backgroundColor: color, width: `${(value / max) * 100}%` }]} />
        {Array.from({ length: max }, (_, i) => i + 1).map((round) => (
          <View key={round} style={[styles.timelineStop, { left: `${(round / max) * 100}%` }]}>
            <View
              style={[
                styles.timelineDot,
                round <= value && { backgroundColor: color, borderColor: color },
                round === value && styles.timelineDotActive,
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.timelineLabels}>
        <Text style={styles.timelineLabel}>Jetzt</Text>
        <Text style={styles.timelineLabel}>Runde {max}</Text>
      </View>
    </View>
  );
}

const styles = themed(() => ({
  guideButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 10 },
  guideText: { color: colors.accent, fontSize: 15, fontWeight: "600" },
  hero: { borderRadius: 28, padding: 24, alignItems: "center", gap: 18 },
  heroText: { fontSize: 17, fontWeight: "600", color: colors.text },
  stack: { flexDirection: "row", alignSelf: "stretch", height: 14, borderRadius: 7, overflow: "hidden" },
  stackPart: { height: "100%" },
  legend: { flexDirection: "row", gap: 16, flexWrap: "wrap", justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: colors.text },
  tiles: { flexDirection: "row", gap: 10 },
  tile: { flex: 1, borderRadius: 20, padding: 14, gap: 4 },
  tileValue: { fontSize: 28, fontWeight: "800" },
  tileLabel: { fontSize: 12, fontWeight: "600" },
  section: { backgroundColor: colors.card, borderRadius: 24, padding: 20, gap: 16 },
  sectionHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  hint: { fontSize: 14, lineHeight: 20, color: colors.muted },
  explain: { backgroundColor: colors.card, borderRadius: 24, padding: 20, gap: 20 },
  explainHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBubble: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  explainTitles: { flex: 1, gap: 2 },
  explainBody: { gap: 22 },
  step: { flexDirection: "row", gap: 12 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  stepNumberText: { fontWeight: "700", color: colors.onPrimary },
  stepBody: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  stepText: { fontSize: 14, lineHeight: 21, color: colors.muted },
  ratings: { gap: 10 },
  rating: { borderRadius: 16, padding: 14, gap: 2 },
  ratingLabel: { fontSize: 16, fontWeight: "700", color: colors.text },
  ratingPoints: { fontSize: 13, fontWeight: "700", color: colors.text },
  ratingDetail: { fontSize: 13, color: colors.text },
  delayRow: { gap: 12, backgroundColor: colors.background, borderRadius: 20, padding: 16 },
  delayHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  delayTitles: { flex: 1, gap: 2 },
  delayLabel: { fontSize: 16, fontWeight: "700", color: colors.text },
  delayValue: { fontSize: 13, color: colors.muted },
  stepper: { flexDirection: "row", gap: 8 },
  stepButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  stepButtonDisabled: { opacity: 0.35 },
  timeline: { height: 24, marginHorizontal: 6, justifyContent: "center" },
  timelineTrack: { position: "absolute", left: 0, right: 0, height: 6, borderRadius: 3, backgroundColor: colors.border },
  timelineFill: { position: "absolute", left: 0, height: 6, borderRadius: 3 },
  timelineStop: { position: "absolute", width: 0, alignItems: "center" },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.card, borderWidth: 2, borderColor: colors.border },
  timelineDotActive: { width: 22, height: 22, borderRadius: 11, borderWidth: 4, borderColor: colors.card, backgroundColor: colors.text },
  timelineLabels: { flexDirection: "row", justifyContent: "space-between" },
  timelineLabel: { fontSize: 12, color: colors.muted },
  segmented: { flexDirection: "row", gap: 4, backgroundColor: colors.background, borderRadius: 16, padding: 4 },
  segment: { flex: 1, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 12 },
  segmentSelected: { backgroundColor: colors.accent },
  segmentText: { fontSize: 15, fontWeight: "600", color: colors.muted },
  segmentTextSelected: { color: colors.onAccent },
  reset: { alignItems: "center", backgroundColor: colors.card, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20 },
  resetText: { color: "#E11D48", fontSize: 16, lineHeight: 22, fontWeight: "500" },
  link: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, paddingVertical: 12 },
  linkText: { color: colors.muted, fontSize: 14, lineHeight: 20, textDecorationLine: "underline" },
}));
