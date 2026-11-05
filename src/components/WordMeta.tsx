import { View } from "react-native";
import { Level, POS_LABELS, Pos, REGISTER_LABELS, Register } from "../data/cards";
import { colors } from "../theme/colors";
import { Text } from "./Text";
import { themed, useTheme } from "../theme/theme";

type Props = { level?: Level; pos?: Pos; register?: Register };

// Kleine Badges für Niveau, Wortart und Stilebene.
export function WordMeta({ level, pos, register }: Props) {
  useTheme();
  const items = [
    level && { key: "level", label: level, strong: true },
    pos && { key: "pos", label: POS_LABELS[pos], strong: false },
    register && register !== "neutral" && { key: "register", label: REGISTER_LABELS[register], strong: false },
  ].filter((item) => !!item);

  if (items.length === 0) return null;
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.key} style={[styles.badge, item.strong && styles.badgeStrong]}>
          <Text style={[styles.text, item.strong && styles.textStrong]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = themed(() => ({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  badge: { backgroundColor: colors.overlay, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeStrong: { backgroundColor: colors.text },
  text: { fontSize: 12, fontWeight: "600", color: colors.text },
  textStrong: { color: colors.onText },
}));
