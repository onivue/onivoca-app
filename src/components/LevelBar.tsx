import { View } from "react-native";
import { LEVELS } from "../data/cards";
import { LevelWeights } from "../lib/difficulty";
import { colors } from "../theme/colors";
import { levelStyle } from "../theme/levels";
import { themed, useTheme } from "../theme/theme";
import { Text } from "./Text";

// Gestapelter Balken: wie viele Karten einer Runde auf welcher Stufe liegen.
export function LevelBar({ counts }: { counts: LevelWeights }) {
  useTheme();
  const levels = LEVELS.filter((l) => counts[l] > 0);
  if (levels.length === 0) return <Text style={styles.empty}>Keine Karten mit Stufe</Text>;

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {levels.map((l) => (
          <View key={l} style={[styles.part, { flex: counts[l], backgroundColor: levelStyle(l).color }]}>
            <Text style={[styles.partText, { color: levelStyle(l).strong }]}>{counts[l]}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        {levels.map((l) => (
          <View key={l} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: levelStyle(l).strong }]} />
            <Text style={styles.legendText}>
              {l} · {counts[l]}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = themed(() => ({
  wrap: { gap: 10 },
  bar: { flexDirection: "row", height: 30, borderRadius: 10, overflow: "hidden", gap: 2 },
  part: { height: "100%", alignItems: "center", justifyContent: "center", minWidth: 22 },
  partText: { fontSize: 13, fontWeight: "700" },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 13, color: colors.text },
  empty: { fontSize: 14, color: colors.muted },
}));
