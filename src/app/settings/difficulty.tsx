import { MixModeList, MixPreview } from "../../components/DifficultyMixer";
import { Screen } from "../../components/Screen";
import { Text } from "../../components/Text";
import { useSentences } from "../../state/cards";
import { colors } from "../../theme/colors";
import { themed, useTheme } from "../../theme/theme";

// Unterseite: wie leichte und schwere Wörter in einer Runde gemischt werden.
export default function DifficultyScreen() {
  useTheme();
  const hasSentences = useSentences().length > 0;

  return (
    <Screen title="Schwierigkeit">
      <Text style={styles.intro}>
        Jedes Wort hat eine Stufe von A1 (leicht) bis C2 (schwer). Wähle, wie deine Runden gemischt werden.
      </Text>
      <MixPreview />
      <MixModeList />
      <Text style={styles.small}>
        Reichen die Wörter einer Stufe nicht, wird mit anderen aufgefüllt. Änderungen gelten ab der nächsten Runde.
        {hasSentences ? " Sätze haben keine Stufe, für sie gilt der Mix nicht." : ""}
      </Text>
    </Screen>
  );
}

const styles = themed(() => ({
  intro: { fontSize: 16, lineHeight: 23, color: colors.muted },
  small: { fontSize: 13, lineHeight: 19, color: colors.muted, paddingHorizontal: 4 },
}));
