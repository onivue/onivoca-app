import { BookOpen, Check, Layers, RotateCw, Sparkles } from "lucide-react-native";
import { ReactNode, useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LANGUAGES, LANG_ORDER } from "../data/cards";
import { useLanguage } from "../state/language";
import { useOnboarding } from "../state/onboarding";
import { colors } from "../theme/colors";
import { RATING_ORDER, RATINGS } from "../theme/ratings";
import { themed, useTheme } from "../theme/theme";
import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

const LANG_HINTS = { en: "Wörter und Wendungen von A2 bis C2", es: "Häufige Wörter und Sätze (A1–B1)" } as const;
const STEPS = 4;

// Kurzer Guide: Sprache wählen und erklären, wie die App funktioniert.
export function OnboardingGuide() {
  const { visible, close } = useOnboarding();
  // Der Inhalt wird nur während der Anzeige eingehängt, so beginnt jeder Start wieder beim ersten Schritt.
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      {visible && <GuideContent />}
    </Modal>
  );
}

function GuideContent() {
  useTheme();
  const insets = useSafeAreaInsets();
  const { close } = useOnboarding();
  const { lang, setLang } = useLanguage();
  const [step, setStep] = useState(0);

  const last = step === STEPS - 1;

  return (
      <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.topRow}>
          <View style={styles.dots}>
            {Array.from({ length: STEPS }, (_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>
          {!last && (
            <Pressable onPress={close} hitSlop={10}>
              <Text style={styles.skip}>Überspringen</Text>
            </Pressable>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {step === 0 && (
            <>
              <Hero icon={<Sparkles color={colors.onAccent} size={30} />} />
              <Text style={styles.title}>Willkommen bei Onivoca</Text>
              <Text style={styles.text}>Welche Sprache möchtest du lernen?</Text>
              <View style={styles.options}>
                {LANG_ORDER.map((id) => {
                  const active = id === lang;
                  return (
                    <PressableScale key={id} style={[styles.option, active && styles.optionActive]} onPress={() => setLang(id)}>
                      <View style={styles.optionTexts}>
                        <Text style={styles.optionTitle}>{LANGUAGES[id].label}</Text>
                        <Text style={styles.optionHint}>{LANG_HINTS[id]}</Text>
                      </View>
                      {active && <Check color={colors.accent} size={22} />}
                    </PressableScale>
                  );
                })}
              </View>
              <Text style={styles.small}>Du kannst die Sprache jederzeit in den Einstellungen ändern.</Text>
            </>
          )}

          {step === 1 && (
            <>
              <Hero icon={<RotateCw color={colors.onAccent} size={30} />} />
              <Text style={styles.title}>Karte umdrehen</Text>
              <Text style={styles.text}>
                Im Tab „Lernen“ siehst du ein Wort oder einen Satz. Überlege dir die Bedeutung, tippe auf die Karte und prüfe deine
                Antwort. Mit dem Lautsprecher hörst du die Aussprache.
              </Text>
              <Text style={styles.text}>Manchmal wird auch umgekehrt gefragt: Du siehst Deutsch und erinnerst dich an die Lernsprache.</Text>
            </>
          )}

          {step === 2 && (
            <>
              <Hero icon={<Layers color={colors.onAccent} size={30} />} />
              <Text style={styles.title}>Ehrlich bewerten</Text>
              <Text style={styles.text}>Nach dem Umdrehen sagst du, wie gut du die Karte kanntest:</Text>
              <View style={styles.ratings}>
                {RATING_ORDER.map((rating) => {
                  const { label, color, textColor, Icon } = RATINGS[rating];
                  return (
                    <View key={rating} style={[styles.rating, { backgroundColor: color }]}>
                      <Icon color={textColor} size={18} />
                      <Text style={[styles.ratingText, { color: textColor }]}>{label}</Text>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.text}>
                „Nochmal“ kommt bald wieder, „Einfach“ erst nach mehreren Runden. Karten mit genug Punkten gelten als gelernt.
              </Text>
            </>
          )}

          {step === 3 && (
            <>
              <Hero icon={<BookOpen color={colors.onAccent} size={30} />} />
              <Text style={styles.title}>Wörter oder Sätze</Text>
              <Text style={styles.text}>
                Im Tab „Lernen“ wählst du, ob du Wörter oder Sätze übst. Eine Runde besteht aus ein paar Karten, es gibt keine Fristen
                und du lernst so lange du willst.
              </Text>
              <Text style={styles.text}>
                Im Tab „Wörter“ stöberst du in allen Karten. In den Einstellungen siehst du deinen Fortschritt und kannst diese Anleitung
                erneut starten.
              </Text>
            </>
          )}
        </ScrollView>

        <View style={styles.buttons}>
          {step > 0 ? (
            <PressableScale style={styles.secondary} onPress={() => setStep(step - 1)}>
              <Text style={styles.secondaryText}>Zurück</Text>
            </PressableScale>
          ) : (
            <View style={styles.spacer} />
          )}
          <PressableScale style={styles.primary} onPress={() => (last ? close() : setStep(step + 1))}>
            <Text style={styles.primaryText}>{last ? "Los geht’s" : "Weiter"}</Text>
          </PressableScale>
        </View>
      </View>
  );
}

function Hero({ icon }: { icon: ReactNode }) {
  useTheme();
  return <View style={styles.hero}>{icon}</View>;
}

const styles = themed(() => ({
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 28 },
  dots: { flexDirection: "row", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 22, backgroundColor: colors.accent },
  skip: { color: colors.muted, fontSize: 15, fontWeight: "500" },
  content: { flexGrow: 1, justifyContent: "center", gap: 16, paddingVertical: 24 },
  hero: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  title: { color: colors.text, fontSize: 32, fontWeight: "700" },
  text: { color: colors.text, fontSize: 17, lineHeight: 24 },
  small: { color: colors.muted, fontSize: 14 },
  options: { gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 18,
  },
  optionActive: { borderColor: colors.accent },
  optionTexts: { flex: 1, gap: 2 },
  optionTitle: { color: colors.text, fontSize: 20, fontWeight: "700" },
  optionHint: { color: colors.muted, fontSize: 14 },
  ratings: { flexDirection: "row", gap: 8 },
  rating: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 14, paddingVertical: 12 },
  ratingText: { fontSize: 14, fontWeight: "600" },
  buttons: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  spacer: { width: 80 },
  secondary: { paddingVertical: 14, paddingHorizontal: 20 },
  secondaryText: { color: colors.muted, fontSize: 16, fontWeight: "600" },
  primary: { backgroundColor: colors.accent, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 32 },
  primaryText: { color: colors.onAccent, fontSize: 16, fontWeight: "600" },
}));
