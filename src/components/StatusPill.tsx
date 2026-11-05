import { View } from "react-native";
import { Status } from "../lib/srs";
import { colors } from "../theme/colors";
import { Text } from "./Text";
import { themed, useTheme } from "../theme/theme";

const STATUS: Record<Status, { label: string; color: string }> = {
  new: { label: "Neu", get color() { return colors.border; } },
  learning: { label: "Am Lernen", get color() { return colors.warning; } },
  mastered: { label: "Gelernt", get color() { return colors.success; } },
};

// Kleines Etikett: Neu / Am Lernen / Gelernt.
export function StatusPill({ status }: { status: Status }) {
  useTheme();
  const { label, color } = STATUS[status];
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = themed(() => ({
  pill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  text: { fontSize: 12, fontWeight: "600", color: colors.text },
}));
