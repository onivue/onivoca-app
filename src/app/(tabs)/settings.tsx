import { useRouter } from "expo-router";
import {
  BadgeCheck,
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
  RotateCcw,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Sun,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { useMixLabel } from "../../components/DifficultyMixer";
import { ProgressRing } from "../../components/ProgressRing";
import { Screen } from "../../components/Screen";
import { Segmented, SettingsField, SettingsGroup, SettingsRow } from "../../components/SettingsUI";
import { Text } from "../../components/Text";
import { LANGUAGES, LANG_ORDER } from "../../data/cards";
import { adPrivacyOptionsRequired, openAdPrivacyOptions } from "../../lib/ads";
import { activeCards, summarize } from "../../lib/srs";
import { useCards, useSentences } from "../../state/cards";
import { useLanguage } from "../../state/language";
import { useOnboarding } from "../../state/onboarding";
import { usePremium } from "../../state/premium";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";
import { themed, useTheme } from "../../theme/theme";

// Tab 3: Übersicht der Einstellungen. Details liegen auf Unterseiten (src/app/settings/).
export default function SettingsScreen() {
  useTheme();
  const router = useRouter();
  const { sessionSize, reshuffle } = useProgress();
  const { pref, setPref } = useTheme();
  const { lang, setLang } = useLanguage();
  const { open: openGuide } = useOnboarding();
  const mixLabel = useMixLabel();

  return (
    <Screen title="Einstellungen">
      <ProgressCard onPress={() => router.push("/settings/progress")} />

      <SettingsGroup>
        <SettingsRow Icon={Shuffle} tint="success" label="Karten neu mischen" onPress={() => confirmShuffle(reshuffle)} />
      </SettingsGroup>

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

      <AdsGroup />

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

// Anders als Zurücksetzen bleiben Lernstand und Statistiken; nur die Reihenfolge neuer Karten wird neu ausgelost.
function confirmShuffle(reshuffle: () => void) {
  Alert.alert(
    "Karten neu mischen?",
    "Neue Karten kommen ab jetzt in zufälliger Reihenfolge dran. Dein Lernstand und alle Statistiken bleiben erhalten. Die aktuelle Runde startet neu.",
    [
      { text: "Abbrechen", style: "cancel" },
      { text: "Neu mischen", onPress: reshuffle },
    ],
  );
}

// Werbung entfernen (einmaliger Kauf), Käufe wiederherstellen und Datenschutz-Optionen für Werbung.
function AdsGroup() {
  const { supported, adsRemoved, price, busy, buy, restore } = usePremium();
  const [privacyRequired, setPrivacyRequired] = useState(false);

  useEffect(() => {
    if (!adsRemoved) adPrivacyOptionsRequired().then(setPrivacyRequired);
  }, [adsRemoved]);

  if (!supported) return null;

  function onBuy() {
    if (busy) return;
    if (!price) {
      Alert.alert("Store nicht erreichbar", "Prüfe deine Internetverbindung und versuche es später noch einmal.");
      return;
    }
    buy();
  }

  async function onRestore() {
    if (busy) return;
    try {
      const found = await restore();
      Alert.alert(
        found ? "Kauf wiederhergestellt" : "Kein Kauf gefunden",
        found ? "Die Werbung ist entfernt. Danke!" : "Mit diesem Konto wurde «Werbung entfernen» noch nicht gekauft.",
      );
    } catch {
      Alert.alert("Wiederherstellen fehlgeschlagen", "Bitte versuche es später noch einmal.");
    }
  }

  if (adsRemoved) {
    return (
      <SettingsGroup title="Werbung" footer="Danke für deine Unterstützung!">
        <SettingsRow Icon={BadgeCheck} tint="success" label="Werbefrei" value="Gekauft" />
      </SettingsGroup>
    );
  }

  return (
    <SettingsGroup
      title="Werbung"
      footer="Einmaliger Kauf, kein Abo. Gilt auf allen Geräten mit derselben Apple-ID."
    >
      <SettingsRow
        Icon={Sparkles}
        tint="warning"
        label="Werbung entfernen"
        value={busy ? "…" : price}
        onPress={onBuy}
      />
      <SettingsRow Icon={RotateCcw} tint="sky" label="Käufe wiederherstellen" onPress={onRestore} />
      {privacyRequired && (
        <SettingsRow
          Icon={SlidersHorizontal}
          tint="accent"
          label="Datenschutz-Optionen"
          onPress={() => openAdPrivacyOptions()}
        />
      )}
    </SettingsGroup>
  );
}

// Kompakter Fortschritt oben; öffnet die Seite mit allen Zahlen.
function ProgressCard({ onPress }: { onPress: () => void }) {
  useTheme();
  const { progress, disabled } = useProgress();
  const { deck } = useLanguage();
  const words = useCards();
  const sentences = useSentences();
  const showSentences = deck === "sentences" && sentences.length > 0;
  const summary = summarize(activeCards(showSentences ? sentences : words, disabled), progress);
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
        {/* Legende zum Balken: Orange = angefangen, hell = noch nie gesehen */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#F59E0B" }]} />
            <Text style={styles.progressMeta}>{summary.learning} angefangen</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.overlay }]} />
            <Text style={styles.progressMeta}>{summary.new} neu</Text>
          </View>
        </View>
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
  legend: { flexDirection: "row", flexWrap: "wrap", columnGap: 14, rowGap: 2 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  progressMeta: { fontSize: 13, color: colors.onPrimary },
}));
