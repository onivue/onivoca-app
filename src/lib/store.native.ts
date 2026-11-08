import {
  ErrorCode,
  Purchase,
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  restorePurchases,
} from "expo-iap";

// Einmaliger Kauf «Werbung entfernen» über App Store / Google Play.
// Apple und Google speichern den Kauf am Konto des Nutzers; ein eigenes Backend braucht es nicht.
// Web-Variante ohne Käufe: store.ts.

// Muss exakt so in App Store Connect und in der Google Play Console angelegt sein
// (Typ: «Nicht-verbrauchbar» bzw. «Einmaliges Produkt»).
export const REMOVE_ADS_SKU = "ch.onivoca.app.remove_ads";

export const STORE_SUPPORTED = true;

export type StoreConnection = { price?: string; owned: boolean; dispose: () => void };

type Handlers = {
  onPurchased: () => void;
  onFailed: (cancelled: boolean) => void;
};

function ownsRemoveAds(purchases: Purchase[]) {
  return purchases.some((p) => p.productId === REMOVE_ADS_SKU && p.purchaseState === "purchased");
}

// Verbindet mit dem Store, hört auf Käufe und liefert Preis sowie ob bereits gekauft wurde.
export async function connectStore({ onPurchased, onFailed }: Handlers): Promise<StoreConnection> {
  const updates = purchaseUpdatedListener((purchase) => {
    if (purchase.productId !== REMOVE_ADS_SKU || purchase.purchaseState !== "purchased") return;
    // Erst freischalten, dann abschliessen. Nicht verbrauchen, sonst wäre der Kauf weg.
    onPurchased();
    finishTransaction({ purchase, isConsumable: false }).catch(() => {});
  });
  const errors = purchaseErrorListener((error) => onFailed(error.code === ErrorCode.UserCancelled));
  const dispose = () => {
    updates.remove();
    errors.remove();
  };

  try {
    await initConnection();
    const [products, purchases] = await Promise.all([
      fetchProducts({ skus: [REMOVE_ADS_SKU], type: "in-app" }).catch(() => null),
      getAvailablePurchases().catch(() => [] as Purchase[]),
    ]);
    const product = (products ?? []).find((p) => p.id === REMOVE_ADS_SKU);

    // Google erstattet Käufe automatisch, die nicht innerhalb von 3 Tagen bestätigt wurden.
    for (const purchase of purchases) {
      if (purchase.productId === REMOVE_ADS_SKU && "isAcknowledgedAndroid" in purchase && purchase.isAcknowledgedAndroid === false) {
        finishTransaction({ purchase, isConsumable: false }).catch(() => {});
      }
    }

    return { price: product?.displayPrice, owned: ownsRemoveAds(purchases), dispose };
  } catch (error) {
    dispose();
    throw error;
  }
}

// Öffnet den Kaufdialog des Stores; das Ergebnis kommt über die Handler von connectStore.
export async function buyRemoveAds() {
  await requestPurchase({
    request: { apple: { sku: REMOVE_ADS_SKU }, google: { skus: [REMOVE_ADS_SKU] } },
    type: "in-app",
  });
}

// Fragt den Store nach früheren Käufen (neues Gerät, App neu installiert).
export async function restoreRemoveAds(): Promise<boolean> {
  await restorePurchases();
  return ownsRemoveAds(await getAvailablePurchases());
}
