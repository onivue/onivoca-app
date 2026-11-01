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
import { ProgressProvider } from "../state/progress";
import { colors } from "../theme/colors";

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
    <CardsProvider>
      <ProgressProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Detailseite eines Worts: mit Zurück-Pfeil */}
        <Stack.Screen
          name="word/[id]"
          options={{
            headerShown: true,
            title: "",
            headerTransparent: true,
            headerShadowVisible: false,
            headerTintColor: colors.text,
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            headerShown: true,
            title: "",
            headerTransparent: true,
            headerShadowVisible: false,
            headerTintColor: colors.text,
          }}
        />
      </Stack>
      </ProgressProvider>
    </CardsProvider>
  );
}
