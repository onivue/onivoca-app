import { Pressable, View } from "react-native";
import { Deck, useLanguage } from "../state/language";
import { colors } from "../theme/colors";
import { themed, useTheme } from "../theme/theme";
import { Text } from "./Text";

const DECKS: { id: Deck; label: string }[] = [
  { id: "words", label: "Wörter" },
  { id: "sentences", label: "Sätze" },
];

// Auswahl, ob man Wörter oder Sätze lernt.
export function DeckSwitch() {
  useTheme();
  const { deck, setDeck } = useLanguage();

  return (
    <View style={styles.row}>
      {DECKS.map(({ id, label }) => {
        const active = id === deck;
        return (
          <Pressable key={id} style={[styles.segment, active && styles.segmentActive]} onPress={() => setDeck(id)}>
            <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = themed(() => ({
  row: { flexDirection: "row", backgroundColor: colors.card, borderRadius: 14, padding: 3, gap: 3 },
  segment: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: 11 },
  segmentActive: { backgroundColor: colors.accent },
  label: { fontSize: 14, fontWeight: "600", color: colors.muted },
  labelActive: { color: colors.onAccent },
}));
