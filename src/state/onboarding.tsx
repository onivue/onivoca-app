import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { usePremium } from "./premium";

const STORAGE_KEY = "onboarding-done-v1";

type OnboardingValue = { visible: boolean; open: () => void; close: () => void };
const OnboardingContext = createContext<OnboardingValue>({ visible: false, open: () => {}, close: () => {} });

// Kurz warten, bis iOS das Einwilligungsformular fertig ausgeblendet hat.
const AFTER_DIALOGS_MS = 400;

// Zeigt den Guide beim ersten Start; über open() lässt er sich jederzeit neu starten (Einstellungen).
// Beim ersten Start erst nach Einwilligungs- und Tracking-Dialog, sonst blockiert iOS die Bedienung.
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const { startupDialogsDone } = usePremium();

  useEffect(() => {
    if (!startupDialogsDone) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((done) => {
        if (!done) timer = setTimeout(() => setVisible(true), AFTER_DIALOGS_MS);
      })
      .catch(() => {});
    return () => clearTimeout(timer);
  }, [startupDialogsDone]);

  function close() {
    setVisible(false);
    AsyncStorage.setItem(STORAGE_KEY, "1").catch(() => {});
  }

  return (
    <OnboardingContext.Provider value={{ visible, open: () => setVisible(true), close }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
