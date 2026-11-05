import { Text as RNText, StyleSheet, TextProps } from "react-native";
import { colors } from "../theme/colors";
import { useTheme } from "../theme/theme";

function fontFor(weight: unknown) {
  switch (String(weight)) {
    case "800":
    case "700":
    case "bold":
      return "SpaceGrotesk_700Bold";
    case "600":
      return "SpaceGrotesk_600SemiBold";
    case "500":
      return "SpaceGrotesk_500Medium";
    default:
      return "SpaceGrotesk_400Regular";
  }
}

export function Text({ style, ...props }: TextProps) {
  useTheme();
  const { fontWeight } = StyleSheet.flatten(style) ?? {};
  return <RNText {...props} style={[{ fontFamily: fontFor(fontWeight), color: colors.text }, style, { fontWeight: undefined }]} />;
}
