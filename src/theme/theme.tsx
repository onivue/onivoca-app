import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Appearance, ImageStyle, StyleSheet, TextStyle, ViewStyle, useColorScheme } from "react-native";
import { TOPICS, TopicId } from "../data/cards";
import { colors, darkColors, lightColors } from "./colors";

export type Scheme = "light" | "dark";
export type ThemePref = "system" | Scheme;

const STORAGE_KEY = "theme-pref-v1";

// Themenfarben: hell = Pastell, dunkel = gedeckter Ton mit hellem Akzent.
const LIGHT_TOPICS = JSON.parse(JSON.stringify(TOPICS)) as typeof TOPICS;
const DARK_TOPICS: Record<TopicId, { color: string; accent: string }> = {
  daily: { color: "#2A2E5C", accent: "#A5B4FC" },
  emotion: { color: "#4A2243", accent: "#F0ABFC" },
  law: { color: "#4A3020", accent: "#FDBA74" },
  society: { color: "#1D3F52", accent: "#7DD3FC" },
  body: { color: "#4A2528", accent: "#FCA5A5" },
  nature: { color: "#1F4430", accent: "#86EFAC" },
  work: { color: "#4A3D15", accent: "#FCD34D" },
};

let version = 0;
let current: Scheme | null = null;

// Schreibt die Farben des Designs in die gemeinsamen Objekte. Wird beim Rendern aufgerufen.
function applyScheme(scheme: Scheme) {
  if (current === scheme) return;
  current = scheme;
  version += 1;
  Object.assign(colors, scheme === "dark" ? darkColors : lightColors);
  for (const id of Object.keys(TOPICS) as TopicId[]) {
    Object.assign(TOPICS[id], scheme === "dark" ? DARK_TOPICS[id] : LIGHT_TOPICS[id]);
  }
}

// Wie StyleSheet.create, rechnet die Styles aber neu, sobald das Design wechselt.
type Styles = Record<string, ViewStyle | TextStyle | ImageStyle>;
export function themed<T extends Styles>(factory: () => T): T {
  let cache: T;
  let cachedVersion = -1;
  return new Proxy({} as T, {
    get(_, key) {
      if (cachedVersion !== version) {
        cache = StyleSheet.create(factory());
        cachedVersion = version;
      }
      return cache[key as keyof T];
    },
  });
}

type ThemeValue = { scheme: Scheme; pref: ThemePref; setPref: (pref: ThemePref) => void };
const ThemeContext = createContext<ThemeValue>({ scheme: "light", pref: "system", setPref: () => {} });

// Jede Komponente, die Farben nutzt, ruft useTheme() auf, damit sie beim Wechsel neu rendert.
export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [pref, setPrefState] = useState<ThemePref | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        const value: ThemePref = stored === "light" || stored === "dark" ? stored : "system";
        Appearance.setColorScheme(value === "system" ? "unspecified" : value);
        setPrefState(value);
      })
      .catch(() => setPrefState("system"));
  }, []);

  if (!pref) return null;

  const scheme: Scheme = pref === "system" ? (system === "dark" ? "dark" : "light") : pref;
  applyScheme(scheme);

  function setPref(next: ThemePref) {
    // Nativ (Tab-Leiste, Header, Tastatur) folgt der Wahl ebenfalls.
    Appearance.setColorScheme(next === "system" ? "unspecified" : next);
    setPrefState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  return <ThemeContext.Provider value={{ scheme, pref, setPref }}>{children}</ThemeContext.Provider>;
}
