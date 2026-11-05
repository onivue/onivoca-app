import { useEffect, useState } from "react";
import { Animated, DimensionValue, Easing, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { themed, useTheme } from "../theme/theme";

// Pulsierender Platzhalter, solange Daten laden.
export function Skeleton({
  width = "100%",
  height = 16,
  radius = 8,
}: {
  width?: DimensionValue;
  height?: number;
  radius?: number;
}) {
  useTheme();
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.border },
        { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }) },
      ]}
    />
  );
}

// Ein einzelner Blob als Platzhalter für die Liste.
export function RowsSkeleton() {
  useTheme();
  return <Skeleton height={320} radius={20} />;
}

// Vollbild-Platzhalter beim ersten Laden.
export function ListSkeleton() {
  useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 20 }]}>
      <Skeleton height={420} radius={20} />
    </View>
  );
}

const styles = themed(() => ({
  screen: { flex: 1, backgroundColor: colors.background, padding: 20 },
}));
