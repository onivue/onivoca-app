# Werbung live schalten (iOS)

Was noch fehlt, damit in onivoca echte Werbung läuft und «Werbung entfernen» gekauft werden kann. Die App erscheint nur auf iOS; Android wird hier nicht behandelt.

Der Code ist fertig: Vollbild-Werbung am Ende jeder Runde, Einwilligungsdialog (UMP), App Tracking Transparency, In-App-Kauf mit Wiederherstellen und die Datenschutzerklärung. Es fehlen nur noch das AdMob-Konto, die echten IDs und die Angaben in App Store Connect.

## Aktueller Stand: Release ohne Werbung

Solange die iOS-Anzeigenblock-ID in [src/lib/ads.native.ts](../src/lib/ads.native.ts) leer ist, zeigt der Release-Build:

- **keine Werbung**, keinen Einwilligungs- und keinen Tracking-Dialog
- **keinen Kaufbereich** «Werbung entfernen» in den Einstellungen; die App verbindet sich dann auch nicht mit dem Store

In der Entwicklung (`__DEV__`) läuft immer Google-Test-Werbung, der Kaufbereich ist sichtbar.

Für den ersten Release ohne Werbung in App Store Connect:

- App-Datenschutz: «Keine Daten erfasst» lassen
- Keinen In-App-Kauf zur Version hinzufügen

Sobald die IDs eingetragen sind und ein neuer Build live ist, sind Werbung und Kaufbereich automatisch an.

## Übersicht

| # | Schritt | Wo |
|---|---|---|
| 1 | AdMob-Konto, Zahlung und Steuern | admob.google.com |
| 2 | App und Anzeigenblock anlegen | AdMob |
| 3 | Einwilligungsmitteilung (DSGVO) veröffentlichen | AdMob → Datenschutz & Mitteilungen |
| 4 | Echte IDs eintragen | `app.json`, `src/lib/ads.native.ts` |
| 5 | SKAdNetwork-IDs ergänzen | `app.json` |
| 6 | app-ads.txt veröffentlichen | eigene Domain |
| 7 | In-App-Kauf anlegen | App Store Connect |
| 8 | Datenschutz- und Prüfungsangaben | App Store Connect |
| 9 | Neu bauen, testen, einreichen | EAS |

---

## 1. AdMob-Konto einrichten

1. Auf [admob.google.com](https://admob.google.com) mit dem Google-Konto anmelden und das Konto erstellen (Land: Schweiz, Zeitzone, Währung CHF).
2. **Zahlungen → Zahlungsinformationen:** Zahlungsprofil anlegen und Bankkonto hinterlegen.
3. **Steuerinformationen** ausfüllen. Google verlangt sie von allen Publishern; als Privatperson ausserhalb der USA ist das in der Regel das Formular W-8BEN.
4. Die **Publisher-ID** notieren (`pub-XXXXXXXXXXXXXXXX`, unter **Einstellungen → Kontoinformationen**). Sie wird für app-ads.txt gebraucht.

Hinweis: Ab rund 10 USD Einnahmen schickt Google einen PIN per Post an die hinterlegte Adresse. Erst wenn er eingegeben ist, wird ausbezahlt.

## 2. App und Anzeigenblock anlegen

1. **Apps → App hinzufügen → iOS**.
2. Frage «Ist die App in einem Store veröffentlicht?»: Ist sie schon live, mit dem App-Store-Eintrag verknüpfen. Sonst «Nein» wählen und später unter **App-Einstellungen → Mit Store verknüpfen** nachholen. Solange die App nicht verknüpft und von AdMob geprüft ist, kommt kaum oder keine Werbung.
3. Die **App-ID** notieren (Format `ca-app-pub-XXXXXXXXXXXXXXXX~NNNNNNNNNN`, mit Tilde).
4. **Anzeigenblöcke → Anzeigenblock hinzufügen → Interstitial** (Name z. B. «Nach Runde»).
5. Die **Anzeigenblock-ID** notieren (Format `ca-app-pub-XXXXXXXXXXXXXXXX/NNNNNNNNNN`, mit Schrägstrich).

## 3. Einwilligungsmitteilung veröffentlichen

Ohne veröffentlichte Mitteilung zeigt die App in der EU, der Schweiz und Grossbritannien keinen Einwilligungsdialog und bekommt dort keine Werbung.

1. **Datenschutz & Mitteilungen → Europäische Vorschriften → Mitteilung erstellen**.
2. Die iOS-App auswählen, Sprache Deutsch (weitere nach Wunsch).
3. **Link zur Datenschutzerklärung** eintragen (die Seite aus `docs/privacy.html` auf GitHub Pages).
4. Optionen: «Schliessen (nicht einwilligen)» aktivieren ist nutzerfreundlich und erlaubt.
5. Werbepartner: die Standardauswahl von Google übernehmen.
6. **Veröffentlichen**.

Optional:

- **IDFA-Erläuterung**: ein Hinweis vor dem Apple-Tracking-Dialog. Erhöht die Zustimmungsrate, ist aber nicht nötig.
- **US-Bundesstaaten-Vorschriften**: nur nötig, wenn du in den USA verbreitest und dort die Opt-out-Pflichten erfüllen willst.

In der App öffnet **Einstellungen → Datenschutz-Optionen** dieses Formular erneut. Der Eintrag erscheint nur dort, wo Google ihn verlangt.

## 4. Echte IDs eintragen

**`app.json`**: Im Plugin `react-native-google-mobile-ads` die iOS-Test-App-ID ersetzen:

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-3940256099942544~3347511713",
    "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~NNNNNNNNNN",
    "delayAppMeasurementInit": true
  }
]
```

Aktuell steht dort Googles Beispiel-ID (`ca-app-pub-3940256099942544~1458002511`). Mit ihr wird nie echte Werbung ausgeliefert. `androidAppId` kann die Beispiel-ID behalten; das Plugin verlangt das Feld, Android wird aber nicht veröffentlicht.

**[src/lib/ads.native.ts](../src/lib/ads.native.ts)**: die Anzeigenblock-ID eintragen:

```ts
const INTERSTITIAL_UNIT_IDS = {
  ios: "ca-app-pub-XXXXXXXXXXXXXXXX/NNNNNNNNNN",
  android: "",
};
```

Damit sind im nächsten Release-Build Werbung und Kaufbereich an. Die IDs sind nicht geheim und dürfen im Repository stehen.

## 5. SKAdNetwork-IDs

Ohne SKAdNetwork-Einträge kann Google auf iOS Werbung nicht zuordnen, das kostet Einnahmen. Das Plugin trägt sie nur ein, wenn sie angegeben sind. In `app.json` beim Plugin ergänzen:

```json
"skAdNetworkItems": [
  "cstr6suwn9.skadnetwork"
]
```

`cstr6suwn9.skadnetwork` ist die ID von Google. Google empfiehlt zusätzlich eine Liste weiterer Werbenetzwerke, die aktuelle Liste steht in der AdMob-Hilfe unter «iOS: SKAdNetwork aktivieren» ([developers.google.com/admob/ios/privacy/strategies](https://developers.google.com/admob/ios/privacy/strategies)). Sie kann vollständig in dieses Array kopiert werden.

## 6. app-ads.txt veröffentlichen

AdMob prüft, ob die Werbung wirklich von dir verkauft wird. Ohne gültige app-ads.txt gibt es deutlich weniger Werbung.

Inhalt der Datei (Publisher-ID aus Schritt 1):

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

Die Datei muss **im Stammverzeichnis der Domain** liegen, die im App Store als Website des Entwicklers eingetragen ist, also `https://deine-domain/app-ads.txt`.

Achtung: Die Datenschutzerklärung liegt auf GitHub Pages unter einem Unterpfad des Repositorys (`…github.io/onivoca-app/`). Eine `docs/app-ads.txt` landet dort ebenfalls im Unterpfad und wird von AdMob **nicht** gefunden. Möglichkeiten:

- **Eigene Domain** (z. B. `onivoca.ch`) für GitHub Pages einrichten (**Settings → Pages → Custom domain**). Dann reicht `docs/app-ads.txt`.
- Oder ein Repository `onivue/onivue.github.io` anlegen und die Datei dort ins Stammverzeichnis legen. Dann ist `https://onivue.github.io` die Entwickler-Website.

Diese Website in **App Store Connect → App-Informationen → Marketing-URL** eintragen.

Danach in AdMob unter **Apps → Alle Apps → app-ads.txt** prüfen. Das Crawlen kann bis zu 24 Stunden dauern.

## 7. In-App-Kauf «Werbung entfernen» anlegen

Die Produkt-ID muss **exakt** `ch.onivoca.app.remove_ads` lauten (siehe [src/lib/store.native.ts](../src/lib/store.native.ts)).

1. **Verträge (Business):** Vertrag «Paid Apps» akzeptieren, Bankkonto und Steuerformulare ausfüllen. Ohne ihn lädt die App keinen Preis.
2. App → **Monetarisierung → In-App-Käufe → +**
   - Typ: **Nicht-verbrauchbar**
   - Referenzname: «Werbung entfernen»
   - Produkt-ID: `ch.onivoca.app.remove_ads`
3. Preis festlegen, Lokalisierung (Anzeigename und Beschreibung) auf Deutsch, Screenshot für die Prüfung hochladen (z. B. die Einstellungsseite mit dem Kaufknopf).
4. Der **erste** In-App-Kauf muss zusammen mit einer App-Version eingereicht werden: In der Version, die die Werbung einschaltet, unter «In-App-Käufe und Abonnements» das Produkt hinzufügen.
5. Zum Testen unter **Benutzer und Zugriff → Sandbox** einen Sandbox-Tester anlegen und auf dem iPhone unter Einstellungen → Developer (bzw. App Store) mit ihm anmelden.

## 8. Datenschutz- und Prüfungsangaben

Diese Angaben gehören zur Version, die die Werbung einschaltet. Sie müssen zur Werbung passen, sonst lehnt Apple die App ab.

**App-Datenschutz** neu ausfüllen (bisher «Keine Daten erfasst»). Mit AdMob mindestens:

| Datentyp | Zweck | Mit Nutzer verknüpft | Für Tracking |
|---|---|---|---|
| Kennungen → Geräte-ID | Werbung von Drittanbietern | Nein | Ja |
| Nutzungsdaten → Produktinteraktion, Werbedaten | Werbung von Drittanbietern, Analyse | Nein | Ja |
| Standort → Ungefährer Standort (über IP) | Werbung von Drittanbietern | Nein | Ja |
| Diagnose → Absturzdaten, Leistungsdaten | Analyse | Nein | Nein |
| Käufe → Kaufverlauf | App-Funktionalität | Nein | Nein |

Google beschreibt die genauen Angaben für das Mobile Ads SDK in der AdMob-Hilfe unter «Datenschutzangaben im App Store».

Weiter:

- **Altersfreigabe** prüfen: Die App enthält jetzt Werbung.
- **Hinweise für die Prüfung** (App Review Information → Notizen), damit Apple alles findet:
  > Die App zeigt nach jeder abgeschlossenen Lernrunde eine Vollbild-Werbung. Der In-App-Kauf «Werbung entfernen» und «Käufe wiederherstellen» befinden sich unter Einstellungen. Der Tracking-Dialog (ATT) erscheint beim ersten Start nach dem Einwilligungsdialog.

Zum Privacy-Manifest in `app.json` (`ios.privacyManifests`): Es beschreibt nur den eigenen Code der App, der weiterhin nichts erfasst. Das Google-SDK bringt ein eigenes Manifest mit, das beim Build automatisch dazukommt. Hier ist nichts zu ändern.

## 9. Neu bauen, testen, einreichen

Die Änderungen an `app.json` betreffen nativen Code. Ein OTA-Update mit `eas update` reicht **nicht**, es braucht einen neuen Build.

1. Echte Werbung testen, ohne dein Konto zu gefährden: In AdMob unter **Einstellungen → Testgeräte** das eigene iPhone eintragen (IDFA). Dann zeigt auch der Release-Build mit echten IDs nur markierte Testanzeigen. **Niemals auf echte Werbung in der eigenen App klicken**: Das gilt als ungültiger Traffic und kann zur Sperrung des AdMob-Kontos führen.
2. Build erstellen:
   ```bash
   npx eas-cli@latest build --platform ios --profile production
   ```
3. Über TestFlight durchspielen:
   - [ ] Erster Start: Einwilligungsdialog erscheint (in der Schweiz/EU), danach der Tracking-Dialog
   - [ ] Am Ende jeder Runde kommt eine Werbung
   - [ ] Einstellungen zeigen den Bereich «Werbung» mit Preis aus dem Store
   - [ ] Einstellungen → Datenschutz-Optionen öffnet das Formular
   - [ ] Kauf mit Sandbox-Tester: Werbung verschwindet sofort, Einstellungen zeigen «Werbefrei»
   - [ ] App löschen, neu installieren, «Käufe wiederherstellen»: Werbung bleibt weg
4. Einreichen:
   ```bash
   npx eas-cli@latest submit --platform ios --profile production
   ```
   Den In-App-Kauf zur Version hinzufügen (Schritt 7) und die Prüfungsnotizen ausfüllen (Schritt 8).
5. Nach dem Release die App in AdMob mit dem App Store verknüpfen, falls in Schritt 2 noch nicht geschehen. Die Prüfung durch AdMob dauert meist einige Tage, danach kommt die volle Werbemenge.

## Nach dem Livegang

- In AdMob unter **Apps** prüfen, dass die App den Status «Bereit» hat und app-ads.txt als gefunden markiert ist.
- In den ersten Tagen ist die Füllrate niedrig, das ist normal.
- Bei Fragen zur Richtlinie oder Warnungen meldet sich AdMob im **Richtlinienzentrum**. Dort regelmässig vorbeischauen.
