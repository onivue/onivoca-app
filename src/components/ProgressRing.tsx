import { useEffect } from "react";
import { Animated, StyleSheet, View, useAnimatedValue } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../theme/colors";
import { Text } from "./Text";
import { themed, useTheme } from "../theme/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = { value: number; size?: number; stroke?: number; color?: string; label?: string };

// Kreisförmiger Fortschritt (value: 0 bis 1) mit Prozentzahl in der Mitte.
export function ProgressRing({ value, size = 180, stroke = 16, color = colors.accent, label }: Props) {
  useTheme();
  const animated = useAnimatedValue(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animated, { toValue: value, duration: 900, useNativeDriver: false }).start();
  }, [animated, value]);

  const dashOffset = animated.interpolate({ inputRange: [0, 1], outputRange: [circumference, 0] });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.overlay} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.percent, { fontSize: Math.round(size * 0.24) }]}>{Math.round(value * 100)}%</Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  );
}

const styles = themed(() => ({
  svg: { position: "absolute" },
  center: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
  percent: { fontSize: 44, fontWeight: "800", color: colors.text },
  label: { fontSize: 13, fontWeight: "600", color: colors.muted },
}));
