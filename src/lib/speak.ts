import { setAudioModeAsync } from "expo-audio";
import * as Speech from "expo-speech";
import { LANGUAGES, Lang } from "../data/cards";

// Wird vom LanguageProvider gesetzt: die Sprache, die gerade gelernt wird.
let currentLang: Lang = "en";
export function setSpeechLang(lang: Lang) {
  currentLang = lang;
}

// Liest einen Text in der Lernsprache vor – auch wenn der iPhone-Stumm-Schalter an ist.
export function speak(text: string) {
  setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  Speech.stop();
  Speech.speak(text, { language: LANGUAGES[currentLang].speech, rate: 0.9, useApplicationAudioSession: true });
}
