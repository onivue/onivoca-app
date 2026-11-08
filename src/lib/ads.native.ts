import {
  PermissionStatus,
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import { Platform } from "react-native";
import mobileAds, {
  AdEventType,
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

// Werbung über Google AdMob: eine Vollbild-Werbung zwischen zwei Lernrunden.
// Web-Variante ohne Werbung: ads.ts.

// Echte Unit-IDs aus AdMob (Apps → Anzeigenblöcke) hier eintragen.
// Solange ein Feld leer ist, zeigt der Release-Build auf dieser Plattform keine Werbung
// (auch keinen Einwilligungs- oder Tracking-Dialog). In der Entwicklung läuft immer Test-Werbung.
const INTERSTITIAL_UNIT_IDS = { ios: "", android: "" };

const unitId = __DEV__ ? TestIds.INTERSTITIAL : Platform.select(INTERSTITIAL_UNIT_IDS);

// Ob dieser Build überhaupt Werbung zeigt. Ohne Werbung blendet die App auch den Kauf «Werbung entfernen» aus.
export const ADS_ENABLED = !!unitId;

let starting: Promise<boolean> | null = null;
let interstitial: InterstitialAd | null = null;

// Fragt die Einwilligung ab (EU/CH/UK, auf iOS zusätzlich App Tracking Transparency)
// und lädt danach die erste Werbung. Mehrfache Aufrufe starten nur einmal.
export function startAds(): Promise<boolean> {
  starting ??= (async () => {
    if (!unitId) return false; // noch keine echte Unit-ID: Werbung aus
    try {
      const { canRequestAds } = await AdsConsent.gatherConsent();
      if (Platform.OS === "ios") {
        const { status } = await getTrackingPermissionsAsync();
        if (status === PermissionStatus.UNDETERMINED) await requestTrackingPermissionsAsync();
      }
      if (!canRequestAds) return false;

      await mobileAds().initialize();
      interstitial = InterstitialAd.createForAdRequest(unitId);
      // Nach dem Schliessen gleich die nächste Werbung vorladen.
      interstitial.addAdEventListener(AdEventType.CLOSED, () => interstitial?.load());
      interstitial.load();
      return true;
    } catch {
      starting = null; // beim nächsten Start erneut versuchen
      return false;
    }
  })();
  return starting;
}

// Nach jeder abgeschlossenen Runde aufrufen; zeigt die Werbung, sobald sie geladen ist.
export function showAdAfterRound() {
  if (!interstitial) return;
  if (!interstitial.loaded) {
    interstitial.load(); // z. B. nach einem Ladefehler; doppelte Aufrufe ignoriert die Library
    return;
  }
  interstitial.show().catch(() => {});
}

// Ob die Datenschutz-Optionen für Werbung angeboten werden müssen (in der EU/CH Pflicht).
export async function adPrivacyOptionsRequired(): Promise<boolean> {
  if (!starting) return false; // Werbung nicht gestartet, z. B. weil sie entfernt wurde
  await starting;
  try {
    const info = await AdsConsent.getConsentInfo();
    return info.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
  } catch {
    return false;
  }
}

// Öffnet Googles Formular, um die Einwilligung für Werbung zu ändern.
export async function openAdPrivacyOptions() {
  await AdsConsent.showPrivacyOptionsForm().catch(() => {});
}
