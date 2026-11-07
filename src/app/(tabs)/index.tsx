import { useState } from "react";
import { View } from "react-native";
import { DeckSwitch } from "../../components/DeckSwitch";
import { Flashcard } from "../../components/Flashcard";
import { ProgressBar } from "../../components/ProgressBar";
import { RatingButtons } from "../../components/RatingButtons";
import { RoundResult, RoundSummary } from "../../components/RoundSummary";
import { Screen } from "../../components/Screen";
import { Text } from "../../components/Text";
import { resolveWeights } from "../../lib/difficulty";
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
  const { progress, round, sessionSize, mix, rate, advanceRound } = useProgress();
  const words = useCards();
  const sentences = useSentences();
  const cards = deck === "sentences" ? sentences : words;

  // Die Warteschlange bleibt bis zum Rundenende stabil.
  const [queue, setQueue] = useState(() =>
    buildSession(cards, progress, round, sessionSize, resolveWeights(mix, cards, progress)),
  );
  const [results, setResults] = useState<RoundResult[]>([]); // für die Übersicht am Rundenende
  const [total, setTotal] = useState(queue.length);
  const [done, setDone] = useState(0);
  const [step, setStep] = useState(0); // sorgt dafür, dass jede Karte neu einfliegt
  const [flipped, setFlipped] = useState(false);

  const current = queue[0];

  function answer(rating: Rating) {
    const before = progress[current.card.id];
    const after = rate(current.card.id, rating);
    setResults([...results, { item: current, rating, before, after, round }]);
    setFlipped(false);
    setStep(step + 1);
    setQueue(queue.slice(1));
    setDone(done + 1);
  }

  function startNewRound() {
    const nextRound = round + 1;
    advanceRound();
    const next = buildSession(cards, progress, nextRound, sessionSize, resolveWeights(mix, cards, progress));
    setQueue(next);
    setTotal(next.length);
    setDone(0);
    setResults([]);
  }

  if (!current) return <RoundSummary results={results} onNext={startNewRound} />;

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
}));
