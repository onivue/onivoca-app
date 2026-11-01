import { setAudioModeAsync } from "expo-audio";
import * as Speech from "expo-speech";

// Liest einen englischen Text vor – auch wenn der iPhone-Stumm-Schalter an ist.
export function speak(text: string) {
  setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  Speech.stop();
  Speech.speak(text, { language: "en-US", rate: 0.9, useApplicationAudioSession: true });
}
