import { ReactNode } from "react";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Text } from "../../components/Text";
import { EASY_DELAY, LEARNING_SLOTS, MASTERED_SCORE, Rating, SCORE_CHANGE } from "../../lib/srs";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";
import { RATING_ORDER, RATINGS } from "../../theme/ratings";
import { themed, useTheme } from "../../theme/theme";

// Unterseite: Punkte, Runden, Mix und Rückblick erklärt.
export default function HowItWorksScreen() {
  useTheme();
  const { sessionSize, delays } = useProgress();
  const comeback: Record<Rating, number> = { again: delays.again, good: delays.good, easy: EASY_DELAY };

  return (
    <Screen title="So geht’s">
      <View style={styles.card}>
        <Step n={1} title="Runden statt Termine">
          Es gibt keine Fristen. Jede Runde besteht aus bis zu {sessionSize} Karten. Du lernst so oft und so lange du willst – nach jeder
          Runde zählt der Rundenzähler hoch.
        </Step>
        <Step n={2} title="Du bewertest jede Karte">
          Nach dem Umdrehen sagst du ehrlich, wie gut du die Karte kanntest:
        </Step>
        <View style={styles.ratings}>
          {RATING_ORDER.map((rating) => {
            const { label, color, textColor } = RATINGS[rating];
            const points = SCORE_CHANGE[rating];
            const rounds = comeback[rating];
            return (
              <View key={rating} style={[styles.rating, { backgroundColor: color }]}>
                <Text style={[styles.ratingLabel, { color: textColor }]}>{label}</Text>
                <Text style={[styles.ratingPoints, { color: textColor }]}>{points > 0 ? `+${points}` : points} Pkt.</Text>
                <Text style={[styles.ratingDetail, { color: textColor }]}>
                  {rounds === 1 ? "kommt in der nächsten Runde wieder" : `kommt in ${rounds} Runden wieder`}
                </Text>
              </View>
            );
          })}
        </View>
        <Step n={3} title={`Ab ${MASTERED_SCORE} Punkten ist sie gelernt`}>
          Jede Karte sammelt Punkte (mindestens 0, höchstens {MASTERED_SCORE}). „Nochmal“ kostet Punkte, damit Wackelkandidaten nicht zu
          früh als gelernt gelten.
        </Step>
        <Step n={4} title="Was in eine Runde kommt">
          Zuerst bis zu {LEARNING_SLOTS} Karten, die du gerade lernst (die schwächsten zuerst), dann neue Karten, danach weitere
          Lernkarten. Sind alle gelernt, gibt es eine Auffrischung. Karten, die noch „Pause“ haben, werden übersprungen.
        </Step>
        <Step n={5} title="Schwierigkeit mischen">
          Jedes Wort hat eine Stufe von A1 bis C2. Mit dem Schwierigkeits-Mix bestimmst du, wie viele Wörter welcher Stufe in eine Runde
          kommen. „Flow“ rückt den Schwerpunkt eine Stufe höher, sobald du eine Stufe zu über 85 % weißt.
        </Step>
        <Step n={6} title="Richtung wechselt">
          Bereits bekannte Karten werden in etwa der Hälfte der Fälle umgekehrt gefragt: Deutsch zeigen, die Lernsprache erraten.
        </Step>
        <Step n={7} title="Rückblick nach jeder Runde">
          Am Ende siehst du alle Karten der Runde mit deiner Bewertung. Tippe eine an, um Bedeutung, Beispiele und den neuen Punktestand zu
          sehen.
        </Step>
        <Step n={8} title="Mischen und aussortieren">
          In den Einstellungen kannst du die Karten neu mischen: Neue Karten kommen dann in zufälliger Reihenfolge, dein Lernstand bleibt.
          Eine Karte, die du nicht mehr sehen willst, deaktivierst du ganz unten auf ihrer Rückseite. In der Wortliste holst du sie zurück.
        </Step>
      </View>
    </Screen>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  useTheme();
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{n}</Text>
      </View>
      <View style={styles.stepBody}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepText}>{children}</Text>
      </View>
    </View>
  );
}

const styles = themed(() => ({
  card: { backgroundColor: colors.card, borderRadius: 24, padding: 20, gap: 22 },
  step: { flexDirection: "row", gap: 12 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  stepNumberText: { fontWeight: "700", color: colors.onPrimary },
  stepBody: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  stepText: { fontSize: 14, lineHeight: 21, color: colors.muted },
  ratings: { gap: 10 },
  rating: { borderRadius: 16, padding: 14, gap: 2 },
  ratingLabel: { fontSize: 16, fontWeight: "700" },
  ratingPoints: { fontSize: 13, fontWeight: "700" },
  ratingDetail: { fontSize: 13 },
}));
