import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CardsProvider } from "../state/cards";
import { OnboardingGuide } from "../components/OnboardingGuide";
import { LanguageProvider } from "../state/language";
import { OnboardingProvider } from "../state/onboarding";
import { PremiumProvider } from "../state/premium";
import { ProgressProvider } from "../state/progress";
import { colors } from "../theme/colors";
import { ThemeProvider, useTheme } from "../theme/theme";

// Wurzel der App: lädt Schrift, Karten (SQLite) und Lernstand, danach die Navigation.
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <PremiumProvider>
        <LanguageProvider>
          <CardsProvider>
            <ProgressProvider>
              <OnboardingProvider>
                <AppStack />
                <OnboardingGuide />
              </OnboardingProvider>
            </ProgressProvider>
          </CardsProvider>
        </LanguageProvider>
      </PremiumProvider>
    </ThemeProvider>
  );
}

// Navigation; liegt unter dem ThemeProvider, damit Statusleiste und Header dem Design folgen.
function AppStack() {
  const { scheme } = useTheme();
  const headerOptions = {
    headerShown: true,
    title: "",
    headerTransparent: true,
    headerShadowVisible: false,
    headerTintColor: colors.text,
  };

  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, headerBackTitle: "Zurück", contentStyle: { backgroundColor: colors.background } }}>
        {/* Detailseite eines Worts: mit Zurück-Pfeil */}
        <Stack.Screen name="word/[id]" options={headerOptions} />
        {/* Unterseiten der Einstellungen */}
        <Stack.Screen name="settings/progress" options={headerOptions} />
        <Stack.Screen name="settings/difficulty" options={headerOptions} />
        <Stack.Screen name="settings/rounds" options={headerOptions} />
        <Stack.Screen name="settings/how-it-works" options={headerOptions} />
        <Stack.Screen name="privacy" options={headerOptions} />
        <Stack.Screen name="licenses" options={headerOptions} />
      </Stack>
    </>
  );
}
