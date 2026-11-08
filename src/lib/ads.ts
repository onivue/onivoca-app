// Web: AdMob gibt es nur auf iOS und Android, hier läuft keine Werbung.
// Die echte Umsetzung liegt in ads.native.ts (gleiche Funktionen).

export const ADS_ENABLED = false;

export async function startAds(): Promise<boolean> {
  return false;
}

export function showAdAfterRound() {}

export async function adPrivacyOptionsRequired(): Promise<boolean> {
  return false;
}

export async function openAdPrivacyOptions() {}
