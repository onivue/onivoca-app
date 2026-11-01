import { PartyPopper } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Flashcard } from "../../components/Flashcard";
import { PressableScale } from "../../components/PressableScale";
import { ProgressBar } from "../../components/ProgressBar";
import { RatingButtons } from "../../components/RatingButtons";
import { Screen } from "../../components/Screen";
import { Text } from "../../components/Text";
import { Rating, buildSession, summarize } from "../../lib/srs";
import { useCards } from "../../state/cards";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";

// Tab 1: Lernrunde mit Karteikarten.
export default function StudyScreen() {
  const { progress, rate } = useProgress();
  const cards = useCards();
  const summary = summarize(cards, progress);

  // Die Warteschlange wird einmal gebaut; "Nochmal"-Karten kommen ans Ende.
  const [queue, setQueue] = useState(() => buildSession(cards, progress));
  const [total, setTotal] = useState(queue.length);
  const [done, setDone] = useState(0);
  const [step, setStep] = useState(0); // sorgt dafür, dass jede Karte neu einfliegt
  const [flipped, setFlipped] = useState(false);

  const current = queue[0];

  function answer(rating: Rating) {
    rate(current.card.id, rating);
    setFlipped(false);
    setStep(step + 1);
    if (rating === "again") {
      setQueue([...queue.slice(1), current]);
    } else {
      setQueue(queue.slice(1));
      setDone(done + 1);
    }
  }

  function startNewRound() {
    const next = buildSession(cards, progress);
    setQueue(next);
    setTotal(next.length);
    setDone(0);
  }

  const overview = (
    <Text style={styles.overview}>
      {summary.mastered} von {summary.total} gelernt · noch {summary.open} offen
    </Text>
  );

  if (!current) {
    return (
      <Screen title="Lernen" scroll={false}>
        {overview}
        <View style={styles.finished}>
          <PartyPopper color={colors.text} size={56} />
          <Text style={styles.finishedTitle}>Runde geschafft!</Text>
          <Text style={styles.finishedText}>Mach eine Pause oder gleich weiter, ganz wie du willst.</Text>
          <PressableScale style={styles.startButton} onPress={startNewRound}>
            <Text style={styles.startButtonText}>Neue Runde</Text>
          </PressableScale>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Lernen" scroll={false}>
      {overview}
      <View style={styles.progress}>
        <View style={styles.bar}>
          <ProgressBar value={total ? done / total : 0} />
        </View>
        <Text style={styles.progressText}>
          {done} / {total}
        </Text>
      </View>

      <Flashcard
        key={`${current.card.id}-${step}`}
        card={current.card}
        reverse={current.reverse}
        flipped={flipped}
        onFlip={() => setFlipped(!flipped)}
      />

      {/* Platz bleibt reserviert, damit nichts springt, wenn die Buttons erscheinen. */}
      <View style={styles.ratingSlot}>{flipped && <RatingButtons key={step} onRate={answer} />}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  overview: { fontSize: 15, color: colors.muted, marginTop: -6 },
  progress: { flexDirection: "row", alignItems: "center", gap: 10 },
  bar: { flex: 1 },
  progressText: { color: colors.muted, fontSize: 13, fontWeight: "500" },
  ratingSlot: { height: 76 },
  finished: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  finishedTitle: { fontSize: 28, fontWeight: "700", color: colors.text },
  finishedText: { fontSize: 16, color: colors.muted, textAlign: "center" },
  startButton: {
    marginTop: 12,
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  startButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
