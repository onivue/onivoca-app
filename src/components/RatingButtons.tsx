import { useEffect } from "react";
import { Animated, StyleSheet, useAnimatedValue, View } from "react-native";
import { Rating } from "../lib/srs";
import { colors } from "../theme/colors";
import { RATING_ORDER, RATINGS } from "../theme/ratings";
import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

// Die drei Bewertungs-Buttons; sie blenden nach dem Umdrehen ein.
export function RatingButtons({ onRate }: { onRate: (rating: Rating) => void }) {
  const appear = useAnimatedValue(0);

  useEffect(() => {
    Animated.spring(appear, { toValue: 1, friction: 8, useNativeDriver: true }).start();
  }, [appear]);

  return (
    <Animated.View
      style={[
        styles.row,
        {
          opacity: appear,
          transform: [{ translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
        },
      ]}
    >
      {RATING_ORDER.map((rating) => {
        const { label, color, Icon } = RATINGS[rating];
        return (
          <View key={rating} style={styles.cell}>
            <PressableScale style={[styles.button, { backgroundColor: color }]} onPress={() => onRate(rating)}>
              <Icon color={colors.text} size={22} />
              <Text style={styles.label}>{label}</Text>
            </PressableScale>
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  cell: { flex: 1 },
  button: { borderRadius: 18, paddingVertical: 14, alignItems: "center", gap: 4 },
  label: { color: colors.text, fontSize: 16, fontWeight: "600" },
});
