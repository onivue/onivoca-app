import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { ADS_ENABLED, startAds, waitForConsentDialogs } from "../lib/ads";
import { SCREENSHOT_MODE } from "../lib/screenshot";
import { STORE_SUPPORTED, buyRemoveAds, connectStore, restoreRemoveAds } from "../lib/store";

// Merkt sich lokal, ob «Werbung entfernen» gekauft wurde, damit beim Start keine Werbung aufblitzt.
// Massgebend ist der Store: Er meldet den Kauf beim Start und beim Wiederherstellen erneut.
const STORAGE_KEY = "ads-removed-v1";

type PremiumValue = {
  supported: boolean; // Kauf wird angeboten: Store vorhanden (nicht im Web) und dieser Build zeigt Werbung
  adsRemoved: boolean;
  price?: string; // vom Store, z. B. «CHF 3.00»; fehlt, solange der Store nicht erreichbar ist
  busy: boolean;
  // Einwilligungs- und Tracking-Dialog beim Start sind erledigt; erst danach darf die App eigene Modals öffnen.
  startupDialogsDone: boolean;
  buy: () => Promise<void>;
  restore: () => Promise<boolean>;
};

const PremiumContext = createContext<PremiumValue>({
  supported: false,
  adsRemoved: false,
  busy: false,
  startupDialogsDone: true,
  buy: async () => {},
  restore: async () => false,
});

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [price, setPrice] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [consentDone, setConsentDone] = useState(false);

  const grant = useCallback(() => {
    setAdsRemoved(true);
    AsyncStorage.setItem(STORAGE_KEY, "1").catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value) setAdsRemoved(true);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!ADS_ENABLED) return; // ohne Werbung gibt es nichts zu kaufen
    let active = true;
    let dispose: (() => void) | undefined;
    connectStore({
      onPurchased: grant,
      onFailed: (cancelled) => {
        if (!cancelled) Alert.alert("Kauf fehlgeschlagen", "Bitte versuche es später noch einmal.");
      },
    })
      .then((store) => {
        if (!active) return store.dispose();
        dispose = store.dispose;
        setPrice(store.price);
        if (store.owned) grant();
      })
      .catch(() => {});
    return () => {
      active = false;
      dispose?.();
    };
  }, [grant]);

  // Werbung (samt Einwilligungsdialog) erst starten, wenn feststeht, dass sie nicht gekauft wurde.
  useEffect(() => {
    if (!loaded || adsRemoved || SCREENSHOT_MODE) return; // Screenshot-Build: keine Einwilligungsdialoge im Bild
    startAds();
    waitForConsentDialogs().then(() => setConsentDone(true));
  }, [loaded, adsRemoved]);
  const startupDialogsDone = loaded && (adsRemoved || SCREENSHOT_MODE || consentDone);

  async function buy() {
    setBusy(true);
    try {
      await buyRemoveAds(); // Ergebnis kommt über onPurchased / onFailed
    } catch {
      // Abbruch und Fehler meldet onFailed
    } finally {
      setBusy(false);
    }
  }

  async function restore() {
    setBusy(true);
    try {
      const owned = await restoreRemoveAds();
      if (owned) grant();
      return owned;
    } finally {
      setBusy(false);
    }
  }

  return (
    <PremiumContext.Provider
      value={{ supported: STORE_SUPPORTED && ADS_ENABLED, adsRemoved, price, busy, startupDialogsDone, buy, restore }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}
