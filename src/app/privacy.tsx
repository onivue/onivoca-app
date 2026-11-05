import { ExternalLink } from "lucide-react-native";
import { Alert, Linking, View } from "react-native";
import { PressableScale } from "../components/PressableScale";
import { Screen } from "../components/Screen";
import { Text } from "../components/Text";
import { colors } from "../theme/colors";
import { themed, useTheme } from "../theme/theme";

const PRIVACY_URL = "https://onivue.github.io/onivoca-app/privacy.html";

export default function PrivacyScreen() {
  useTheme();
  return (
    <Screen title="Datenschutz">
      <View style={styles.content}>
        <Text style={styles.body}>Die aktuelle Datenschutzerklärung findest du online.</Text>
        <PressableScale
          style={styles.link}
          accessibilityRole="link"
          accessibilityLabel="Datenschutzerklärung auf GitHub Pages öffnen"
          onPress={() => {
            Linking.openURL(PRIVACY_URL).catch(() =>
              Alert.alert("Link konnte nicht geöffnet werden", PRIVACY_URL),
            );
          }}
        >
          <ExternalLink size={18} color={colors.accent} />
          <Text style={styles.linkText}>Datenschutzerklärung öffnen</Text>
        </PressableScale>
        <Text style={styles.url}>{PRIVACY_URL}</Text>
      </View>
    </Screen>
  );
}

const styles = themed(() => ({
  content: { gap: 12 },
  body: { color: colors.text, fontSize: 15, lineHeight: 23 },
  link: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 8,
    paddingVertical: 10,
  },
  linkText: { color: colors.accent, fontSize: 16, fontWeight: "600" },
  url: { color: colors.muted, fontSize: 13, lineHeight: 19 },
}));
