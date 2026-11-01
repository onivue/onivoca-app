import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Text } from "./Text";

type Props = {
  title: string;
  scroll?: boolean; // false: feste Seite ohne Scrollen, Inhalt füllt den Platz
  children: ReactNode;
};

// Gemeinsamer Rahmen für jede Seite: Titel, Hintergrund, Abstände.
export function Screen({ title, scroll = true, children }: Props) {
  const insets = useSafeAreaInsets();

  if (!scroll) {
    return (
      <View
        style={[
          styles.screen,
          styles.fixed,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 },
        ]}
      >
        <Text style={[styles.title, styles.titleCompact]}>{title}</Text>
        {children}
      </View>
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  fixed: { paddingHorizontal: 20, gap: 12 },
  title: { fontSize: 36, fontWeight: "700", color: colors.text },
  titleCompact: { fontSize: 30 },
});
