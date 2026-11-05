import { PartyPopper } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { DeckSwitch } from "../../components/DeckSwitch";
import { Flashcard } from "../../components/Flashcard";
import { PressableScale } from "../../components/PressableScale";
import { ProgressBar } from "../../components/ProgressBar";
import { RatingButtons } from "../../components/RatingButtons";
import { Screen } from "../../components/Screen";
import { Text } from "../../components/Text";
import { Rating, buildSession } from "../../lib/srs";
import { useCards, useSentences } from "../../state/cards";
import { LANGUAGES, Lang } from "../../data/cards";
import { Deck, useLanguage } from "../../state/language";
import { useProgress } from "../../state/progress";
import { colors } from "../../theme/colors";
import { themed, useTheme } from "../../theme/theme";

// Tab 1: Sprachwahl und Lernrunde mit Karteikarten.
export default function StudyScreen() {
  const { lang, deck } = useLanguage();
  const hasSentences = useSentences().length > 0;
  const activeDeck = hasSentences ? deck : "words";
  return (
    <Screen title="Lernen" titleAccessory={<LanguageBadge lang={lang} />} scroll={false}>
      {hasSentences && <DeckSwitch />}
      {/* Beim Wechsel von Sprache oder Kartenart startet die Runde neu. */}
      <StudySession key={`${lang}-${activeDeck}`} deck={activeDeck} />
    </Screen>
  );
}

// Zeigt neben dem Titel, welche Sprache gerade gelernt wird.
function LanguageBadge({ lang }: { lang: Lang }) {
  useTheme();
  return (
    <View style={styles.langBadge}>
      <Text style={styles.langBadgeText}>{LANGUAGES[lang].label}</Text>
    </View>
  );
}

function StudySession({ deck }: { deck: Deck }) {
  useTheme();
  const { progress, round, sessionSize, rate, advanceRound } = useProgress();
  const words = useCards();
  const sentences = useSentences();
  const cards = deck === "sentences" ? sentences : words;

  // Die Warteschlange bleibt bis zum Rundenende stabil.
  const [queue, setQueue] = useState(() => buildSession(cards, progress, round, sessionSize));
  const [total, setTotal] = useState(queue.length);
  const [done, setDone] = useState(0);
  const [step, setStep] = useState(0); // sorgt dafür, dass jede Karte neu einfliegt
  const [flipped, setFlipped] = useState(false);

  const current = queue[0];

  function answer(rating: Rating) {
    rate(current.card.id, rating);
    setFlipped(false);
    setStep(step + 1);
    setQueue(queue.slice(1));
    setDone(done + 1);
  }

  function startNewRound() {
    const nextRound = round + 1;
    advanceRound();
    const next = buildSession(cards, progress, nextRound, sessionSize);
    setQueue(next);
    setTotal(next.length);
    setDone(0);
  }

  if (!current) {
    return (
      <View style={styles.finished}>
        <PartyPopper color={colors.text} size={56} />
        <Text style={styles.finishedTitle}>Runde geschafft!</Text>
        <Text style={styles.finishedText}>Mach eine Pause oder gleich weiter, ganz wie du willst.</Text>
        <PressableScale style={styles.startButton} onPress={startNewRound}>
          <Text style={styles.startButtonText}>Neue Runde</Text>
        </PressableScale>
      </View>
    );
  }

  return (
    <>
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
        onFlip={() => setFlipped(true)}
      />

      {/* Platz bleibt reserviert, damit nichts springt, wenn die Buttons erscheinen. */}
      <View style={styles.ratingSlot}>{flipped && <RatingButtons key={step} onRate={answer} />}</View>
    </>
  );
}

const styles = themed(() => ({
  langBadge: { backgroundColor: colors.accent, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5 },
  langBadgeText: { color: colors.onAccent, fontSize: 14, fontWeight: "600" },
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
  startButtonText: { color: colors.onAccent, fontSize: 16, fontWeight: "600" },
}));
