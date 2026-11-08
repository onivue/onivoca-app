// Web: keine In-App-Käufe. Die echte Umsetzung liegt in store.native.ts (gleiche Funktionen).

export const REMOVE_ADS_SKU = "ch.onivoca.app.remove_ads";

export const STORE_SUPPORTED = false;

export type StoreConnection = { price?: string; owned: boolean; dispose: () => void };

type Handlers = {
  onPurchased: () => void;
  onFailed: (cancelled: boolean) => void;
};

export async function connectStore(_handlers: Handlers): Promise<StoreConnection> {
  return { owned: false, dispose: () => {} };
}

export async function buyRemoveAds() {}

export async function restoreRemoveAds(): Promise<boolean> {
  return false;
}
