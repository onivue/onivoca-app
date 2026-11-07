import { useRouter } from "expo-router";
import {
  ChevronRight,
  CircleHelp,
  FileText,
  Gauge,
  Languages,
  Lightbulb,
  Monitor,
  Moon,
  Palette,
  Repeat,
  ShieldCheck,
  Sun,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useMixLabel } from "../../components/DifficultyMixer";
import { ProgressRing } from "../../components/ProgressRing";
import { Screen } from "../../components/Screen";
import { Segmented, SettingsField, SettingsGroup, SettingsRow } from "../../components/SettingsUI";
import { Text } from "../../components/Text";
import { LANGUAGES, LANG_ORDER } from "../../data/cards";
import { summarize } from "../../lib/srs";
import { useCards, useSentences } from "../../state/cards";
import { useLanguage } from "../../state/language";
import { useOnboarding } from "../../state/onboarding";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";
import { themed, useTheme } from "../../theme/theme";

// Tab 3: Übersicht der Einstellungen. Details liegen auf Unterseiten (src/app/settings/).
export default function SettingsScreen() {
  useTheme();
  const router = useRouter();
  const { sessionSize } = useProgress();
  const { pref, setPref } = useTheme();
  const { lang, setLang } = useLanguage();
  const { open: openGuide } = useOnboarding();
  const mixLabel = useMixLabel();

  return (
    <Screen title="Einstellungen">
      <ProgressCard onPress={() => router.push("/settings/progress")} />

      <SettingsGroup title="Lernen" footer="Der Lernstand wird pro Sprache getrennt gespeichert.">
        <SettingsField Icon={Languages} tint="sky" label="Sprache">
          <Segmented
            options={LANG_ORDER.map((id) => ({ value: id, label: LANGUAGES[id].label }))}
            value={lang}
            onChange={setLang}
          />
        </SettingsField>
        <SettingsRow
          Icon={Gauge}
          tint="pink"
          label="Schwierigkeit"
          value={mixLabel}
          onPress={() => router.push("/settings/difficulty")}
        />
        <SettingsRow
          Icon={Repeat}
          tint="orange"
          label="Runden & Wiederholung"
          value={`${sessionSize} Karten`}
          onPress={() => router.push("/settings/rounds")}
        />
      </SettingsGroup>

      <SettingsGroup title="Darstellung">
        <SettingsField Icon={Palette} tint="primary" label="Design">
          <Segmented
            options={[
              { value: "system" as const, label: "System", icon: <Monitor color={colors.text} size={16} /> },
              { value: "light" as const, label: "Hell", icon: <Sun color={colors.text} size={16} /> },
              { value: "dark" as const, label: "Dunkel", icon: <Moon color={colors.text} size={16} /> },
            ]}
            value={pref}
            onChange={setPref}
          />
        </SettingsField>
      </SettingsGroup>

      <SettingsGroup title="Hilfe">
        <SettingsRow Icon={CircleHelp} tint="success" label="Anleitung ansehen" onPress={openGuide} />
        <SettingsRow
          Icon={Lightbulb}
          tint="warning"
          label="So funktioniert das Lernen"
          onPress={() => router.push("/settings/how-it-works")}
        />
      </SettingsGroup>

      <SettingsGroup title="Rechtliches">
        <SettingsRow Icon={ShieldCheck} tint="accent" label="Datenschutz" onPress={() => router.push("/privacy")} />
        <SettingsRow Icon={FileText} tint="accent" label="Drittanbieter-Lizenzen" onPress={() => router.push("/licenses")} />
      </SettingsGroup>
    </Screen>
  );
}

// Kompakter Fortschritt oben; öffnet die Seite mit allen Zahlen.
function ProgressCard({ onPress }: { onPress: () => void }) {
  useTheme();
  const { progress, round } = useProgress();
  const { deck } = useLanguage();
  const words = useCards();
  const sentences = useSentences();
  const showSentences = deck === "sentences" && sentences.length > 0;
  const summary = summarize(showSentences ? sentences : words, progress);
  const total = Math.max(summary.total, 1);

  return (
    <Pressable
      style={({ pressed }) => [styles.progress, pressed && styles.progressPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Fortschritt: ${summary.mastered} von ${summary.total} gelernt`}
    >
      <ProgressRing value={summary.mastered / total} size={92} stroke={10} color={colors.accent} />
      <View style={styles.progressTexts}>
        <Text style={styles.progressTitle}>Dein Fortschritt</Text>
        <Text style={styles.progressText}>
          {summary.mastered} von {summary.total} {showSentences ? "Sätzen" : "Wörtern"} gelernt
        </Text>
        <View style={styles.stack}>
          <View style={[styles.stackPart, { flex: summary.mastered, backgroundColor: "#16A34A" }]} />
          <View style={[styles.stackPart, { flex: summary.learning, backgroundColor: "#F59E0B" }]} />
          <View style={[styles.stackPart, { flex: summary.new, backgroundColor: colors.overlay }]} />
        </View>
        <Text style={styles.progressMeta}>
          Runde {round + 1} · {summary.learning} am Lernen
        </Text>
      </View>
      <ChevronRight color={colors.onPrimary} size={20} />
    </Pressable>
  );
}

const styles = themed(() => ({
  progress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 16,
  },
  progressPressed: { opacity: 0.85 },
  progressTexts: { flex: 1, gap: 6 },
  progressTitle: { fontSize: 13, fontWeight: "700", color: colors.onPrimary, textTransform: "uppercase", letterSpacing: 0.4 },
  progressText: { fontSize: 16, fontWeight: "600", color: colors.text },
  stack: { flexDirection: "row", height: 8, borderRadius: 4, overflow: "hidden" },
  stackPart: { height: "100%" },
  progressMeta: { fontSize: 13, color: colors.onPrimary },
}));
