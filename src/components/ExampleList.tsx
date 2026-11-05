import { Volume2 } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Example } from "../data/cards";
import { speak } from "../lib/speak";
import { colors } from "../theme/colors";
import { Text } from "./Text";
import { themed, useTheme } from "../theme/theme";

type Props = { examples: Example[]; accent: string };

// Teilt den Satz um die Fundstelle des Lemmas, damit sie hervorgehoben werden kann.
function splitAtHit(en: string, hit?: string) {
  const index = hit ? en.toLocaleLowerCase("en").indexOf(hit.toLocaleLowerCase("en")) : -1;
  if (!hit || index < 0) return { before: en, match: "", after: "" };
  return { before: en.slice(0, index), match: en.slice(index, index + hit.length), after: en.slice(index + hit.length) };
}

// Beispielsätze mit hervorgehobenem Zielwort; Tippen liest den Satz vor.
export function ExampleList({ examples, accent }: Props) {
  useTheme();
  return (
    <View style={styles.list}>
      {examples.map((example) => {
        const { before, match, after } = splitAtHit(example.en, example.hit);
        return (
          <Pressable key={example.en} style={[styles.example, { borderLeftColor: accent }]} onPress={() => speak(example.en)}>
            <View style={styles.texts}>
              <Text style={styles.en}>
                {before}
                {match ? <Text style={[styles.en, { color: accent }]}>{match}</Text> : null}
                {after}
              </Text>
              <Text style={styles.de}>{example.de}</Text>
            </View>
            <Volume2 color={accent} size={20} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = themed(() => ({
  list: { gap: 14 },
  example: { flexDirection: "row", alignItems: "center", gap: 12, borderLeftWidth: 3, borderLeftColor: "transparent", paddingLeft: 12 },
  texts: { flex: 1, gap: 4 },
  en: { fontSize: 16, fontWeight: "600", color: colors.text },
  de: { fontSize: 14, lineHeight: 20, color: colors.muted },
}));
