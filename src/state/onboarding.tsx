import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "onboarding-done-v1";

type OnboardingValue = { visible: boolean; open: () => void; close: () => void };
const OnboardingContext = createContext<OnboardingValue>({ visible: false, open: () => {}, close: () => {} });

// Zeigt den Guide beim ersten Start; über open() lässt er sich jederzeit neu starten (Einstellungen).
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((done) => {
        if (!done) setVisible(true);
      })
      .catch(() => {});
  }, []);

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
