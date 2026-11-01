import { Lightbulb, RotateCw, Volume2 } from "lucide-react-native";
import { useEffect } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, View, useAnimatedValue } from "react-native";
import { CATEGORIES, CardData } from "../data/cards";
import { speak } from "../lib/speak";
import { colors } from "../theme/colors";
import { Text } from "./Text";

type Props = {
  card: CardData;
  reverse: boolean; // true: Deutsch wird gezeigt, Englisch muss erraten werden
  flipped: boolean;
  onFlip: () => void;
};

// Karteikarte mit Vorder- und Rückseite. Tippen dreht sie um.
export function Flashcard({ card, reverse, flipped, onFlip }: Props) {
  const category = CATEGORIES[card.category];
  const isPhrase = card.category === "phrasen";
  const frontText = reverse ? card.back : card.front;
  const smallFront = isPhrase || frontText.length > 16;

  // 0 -> 1: Karte fliegt beim Erscheinen ein.
  const enter = useAnimatedValue(0);
  // 0 -> 1: Karte dreht sich von Vorder- auf Rückseite.
  const flip = useAnimatedValue(0);

  useEffect(() => {
    Animated.spring(enter, { toValue: 1, friction: 7, useNativeDriver: true }).start();
  }, [enter]);

  useEffect(() => {
    Animated.spring(flip, {
      toValue: flipped ? 1 : 0,
      friction: 8,
      tension: 12,
      useNativeDriver: true,
    }).start();
  }, [flip, flipped]);

  const rotateY = (from: string, to: string) => ({
    transform: [
      { perspective: 1200 },
      { rotateY: flip.interpolate({ inputRange: [0, 1], outputRange: [from, to] }) },
    ],
  });

  const enterStyle = {
    opacity: enter,
    transform: [
      { translateX: enter.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) },
      { scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
    ],
  };

  return (
    <Animated.View style={[styles.wrapper, enterStyle]}>
      <Pressable style={styles.wrapper} onPress={onFlip}>
        {/* Vorderseite. pointerEvents: nur die sichtbare Seite darf Taps annehmen. */}
        <Animated.View
          pointerEvents={flipped ? "none" : "auto"}
          style={[styles.face, rotateY("0deg", "180deg")]}
        >
          <View style={[styles.fill, styles.front, { backgroundColor: category.color }]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {category.label} · {isPhrase ? "Satz" : "Wort"}
              </Text>
            </View>

            <View style={styles.center}>
              <Text style={[styles.frontText, smallFront && styles.frontTextSmall]}>{frontText}</Text>
              {reverse ? (
                <Text style={styles.phonetic}>Wie heisst das auf Englisch?</Text>
              ) : (
                <>
                  {card.phonetic.length > 0 && (
                    <Text style={styles.phonetic}>{card.phonetic}</Text>
                  )}
                  <Pressable style={styles.speakButton} onPress={() => speak(card.front)} hitSlop={10}>
                    <Volume2 color={colors.text} size={26} />
                  </Pressable>
                </>
              )}
            </View>

            <View style={styles.hint}>
              <RotateCw color={colors.muted} size={16} />
              <Text style={styles.hintText}>Tippen zum Umdrehen</Text>
            </View>
          </View>
        </Animated.View>

        {/* Rückseite */}
        <Animated.View
          pointerEvents={flipped ? "auto" : "none"}
          style={[styles.face, rotateY("180deg", "360deg")]}
        >
          <ScrollView
            style={styles.back}
            contentContainerStyle={styles.backContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.label, { color: category.accent }]}>Englisch</Text>
            <View style={styles.englishRow}>
              <View style={styles.englishTexts}>
                <Text style={[styles.englishWord, isPhrase && styles.englishPhrase]}>{card.front}</Text>
                {card.phonetic.length > 0 && (
                  <Text style={styles.englishPhonetic}>{card.phonetic}</Text>
                )}
              </View>
              <Pressable style={styles.speakSmall} onPress={() => speak(card.front)} hitSlop={10}>
                <Volume2 color={colors.text} size={22} />
              </Pressable>
            </View>

            <Text style={[styles.label, { color: category.accent }]}>Deutsch</Text>
            <Text style={styles.backText}>{card.back}</Text>

            <Text style={styles.label}>Beispiele</Text>
            {card.examples.map((example) => (
              <Pressable key={example.en} style={styles.example} onPress={() => speak(example.en)}>
                <View style={styles.exampleTexts}>
                  <Text style={styles.exampleEn}>{example.en}</Text>
                  <Text style={styles.exampleDe}>{example.de}</Text>
                </View>
                <Volume2 color={category.accent} size={20} />
              </Pressable>
            ))}

            {card.note && (
              <View style={[styles.note, { backgroundColor: category.color }]}>
                <Lightbulb color={colors.text} size={18} />
                <Text style={styles.noteText}>{card.note}</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, minHeight: 280 },
  // Beide Seiten liegen übereinander; die abgewandte Seite wird ausgeblendet.
  face: {
    ...StyleSheet.absoluteFill,
    backfaceVisibility: "hidden",
    borderRadius: 28,
  },
  fill: { flex: 1, borderRadius: 28, padding: 24 },
  front: { justifyContent: "space-between" },
  back: { flex: 1, borderRadius: 28, backgroundColor: colors.card },
  backContent: { flexGrow: 1, padding: 24, gap: 10 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  center: { alignItems: "center", gap: 12 },
  frontText: { color: colors.text, fontSize: 44, fontWeight: "700", textAlign: "center" },
  frontTextSmall: { fontSize: 30 },
  phonetic: { color: colors.muted, fontSize: 20 },
  speakButton: {
    marginTop: 8,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  hint: { flexDirection: "row", alignSelf: "center", alignItems: "center", gap: 6 },
  hintText: { color: colors.muted, fontSize: 14 },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  backText: { fontSize: 22, fontWeight: "600", color: colors.text },
  englishRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  englishTexts: { flex: 1 },
  englishWord: { fontSize: 30, fontWeight: "700", color: colors.text },
  englishPhrase: { fontSize: 22 },
  englishPhonetic: { fontSize: 15, color: colors.muted },
  speakSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  example: { flexDirection: "row", alignItems: "center", gap: 10 },
  exampleTexts: { flex: 1, gap: 2 },
  exampleEn: { fontSize: 16, fontWeight: "600", color: colors.text },
  exampleDe: { fontSize: 14, color: colors.muted },
  note: { marginTop: "auto", flexDirection: "row", gap: 10, borderRadius: 14, padding: 12 },
  noteText: { flex: 1, fontSize: 14, color: colors.text },
});
