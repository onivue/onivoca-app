import { useEffect } from "react";
import { Animated, StyleSheet, View, useAnimatedValue } from "react-native";
import { colors } from "../theme/colors";

// Fortschrittsbalken (value: 0 bis 1), der sanft zum neuen Wert läuft.
export function ProgressBar({ value, color = colors.accent }: { value: number; color?: string }) {
  const animated = useAnimatedValue(value);

  useEffect(() => {
    // Breite kann nicht nativ animiert werden, daher useNativeDriver: false.
    Animated.timing(animated, { toValue: value, duration: 400, useNativeDriver: false }).start();
  }, [animated, value]);

  const width = animated.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: 5, backgroundColor: colors.border, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 5 },
});
