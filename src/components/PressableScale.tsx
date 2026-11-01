import { ReactNode } from "react";
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle, useAnimatedValue } from "react-native";

type Props = Omit<PressableProps, "style" | "children"> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

// Button, der beim Drücken federnd schrumpft.
export function PressableScale({ children, style, ...props }: Props) {
  const scale = useAnimatedValue(1);

  function animateTo(toValue: number) {
    Animated.spring(scale, { toValue, speed: 30, bounciness: 6, useNativeDriver: true }).start();
  }

  return (
    <Pressable {...props} onPressIn={() => animateTo(0.94)} onPressOut={() => animateTo(1)}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
