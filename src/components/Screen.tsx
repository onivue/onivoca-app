import { ReactNode, useEffect, useState } from "react";
import { Animated, ScrollView, useAnimatedValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Text } from "./Text";
import { themed, useTheme } from "../theme/theme";

type Props = {
  title: string;
  scroll?: boolean; // false: feste Seite ohne Scrollen, Inhalt füllt den Platz
  children: ReactNode;
};

// Gemeinsamer Rahmen für jede Seite: Titel, Hintergrund, Abstände.
export function Screen({ title, scroll = true, children }: Props) {
  useTheme();
  const insets = useSafeAreaInsets();
  const reveal = useAnimatedValue(0);
  const [settled, setSettled] = useState(false);

  // Beim Start liefern die nativen Tabs den unteren Rand (Tab-Leiste) erst nach dem ersten Layout.
  // Feste Seiten bleiben deshalb kurz unsichtbar, bis sich der Rand nicht mehr ändert, damit nichts springt.
  useEffect(() => {
    if (scroll) return;
    const timer = setTimeout(() => setSettled(true), 150);
    return () => clearTimeout(timer);
  }, [scroll, insets.bottom, insets.top]);

  useEffect(() => {
    if (settled) Animated.timing(reveal, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  }, [settled, reveal]);

  if (!scroll) {
    return (
      <Animated.View
        style={[
          styles.screen,
          styles.fixed,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8, opacity: reveal },
        ]}
      >
        <Text style={[styles.title, styles.titleCompact]}>{title}</Text>
        {children}
      </Animated.View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={styles.title}>{title}</Text>
      {children}
    </ScrollView>
  );
}

const styles = themed(() => ({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  fixed: { paddingHorizontal: 20, gap: 12 },
  title: { fontSize: 36, fontWeight: "700", color: colors.text },
  titleCompact: { fontSize: 30 },
}));
