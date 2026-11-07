import { CalendarClock, Minus, Plus, RefreshCcw } from "lucide-react-native";
import { ReactNode } from "react";
import { View } from "react-native";
import { PressableScale } from "../../components/PressableScale";
import { Screen } from "../../components/Screen";
import { Segmented, SettingsCard } from "../../components/SettingsUI";
import { Text } from "../../components/Text";
import { EASY_DELAY, SESSION_SIZES } from "../../lib/srs";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";
import { themed, useTheme } from "../../theme/theme";

// Unterseite: Rundenlänge und nach wie vielen Runden Karten wiederkommen.
export default function RoundsScreen() {
  useTheme();
  const { sessionSize, setSessionSize, delays, setDelay } = useProgress();

  return (
    <Screen title="Runden">
      <SettingsCard title="Rundenlänge" hint="So viele Karten gehören zu einer Runde. Die Änderung gilt ab der nächsten Runde.">
        <Segmented
          options={SESSION_SIZES.map((size) => ({ value: size, label: String(size) }))}
          value={sessionSize}
          onChange={setSessionSize}
        />
      </SettingsCard>

      <SettingsCard
        title="Wiederholungsabstand"
        hint="Nach wie vielen Runden eine Karte frühestens wieder auftaucht. Kürzer = mehr Übung, länger = mehr Abwechslung."
      >
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
      </SettingsCard>
    </Screen>
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
  hint: { fontSize: 14, lineHeight: 20, color: colors.muted },
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
}));
