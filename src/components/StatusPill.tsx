import { StyleSheet, View } from "react-native";
import { Status } from "../lib/srs";
import { colors } from "../theme/colors";
import { Text } from "./Text";

const STATUS: Record<Status, { label: string; color: string }> = {
  new: { label: "Neu", color: colors.border },
  learning: { label: "Am Lernen", color: colors.warning },
  mastered: { label: "Gelernt", color: colors.success },
};

// Kleines Etikett: Neu / Am Lernen / Gelernt.
export function StatusPill({ status }: { status: Status }) {
  const { label, color } = STATUS[status];
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  text: { fontSize: 12, fontWeight: "600", color: colors.text },
});
