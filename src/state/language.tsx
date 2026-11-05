import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { LANG_ORDER, Lang } from "../data/cards";
import { setSpeechLang } from "../lib/speak";

const STORAGE_KEY = "learn-language-v1";
const DECK_KEY = "learn-deck-v1";

export type Deck = "words" | "sentences";

type LanguageValue = { lang: Lang; setLang: (lang: Lang) => void; deck: Deck; setDeck: (deck: Deck) => void };
const LanguageContext = createContext<LanguageValue>({ lang: "en", setLang: () => {}, deck: "words", setDeck: () => {} });

// Merkt sich, welche Sprache gelernt wird (Englisch oder Spanisch).
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [deck, setDeckState] = useState<Deck>("words");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(STORAGE_KEY), AsyncStorage.getItem(DECK_KEY)])
      .then(([stored, storedDeck]) => {
        if (stored && LANG_ORDER.includes(stored as Lang)) setLangState(stored as Lang);
        if (storedDeck === "sentences") setDeckState("sentences");
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  setSpeechLang(lang);

  function setLang(next: Lang) {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  function setDeck(next: Deck) {
    setDeckState(next);
    AsyncStorage.setItem(DECK_KEY, next).catch(() => {});
  }

  if (!ready) return null;
  return <LanguageContext.Provider value={{ lang, setLang, deck, setDeck }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
