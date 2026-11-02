# iOS-Release Schweiz

## 1. Rechte und Freigaben

- [ ] App-Name «Onivoca» und Bundle-ID `com.onivoca.app` in Apple Developer prüfen; Rechte bestätigen. Die öffentliche CH-Suche ergab am 2. November 2026 keinen Treffer.
- [ ] Rechte an KI-generierten Karten, Übersetzungen und Beispielen klären. Der Anbieter ist unbekannt; andernfalls Inhalte mit belegbarer Herkunft verwenden.
- [ ] Rechte an Schrift, Marke, finalem App-Icon und Store-Grafiken bestätigen.
- [ ] Datenschutzerklärung nach Schweizer DSG prüfen lassen. Klären, ob eine postalische Kontaktadresse nötig ist; bis dahin keine Wohnadresse veröffentlichen.

## 2. Öffentliche Kontaktseiten

- [x] Zentrale Datenschutzerklärung unter `docs/privacy.html` erstellt; die App verlinkt auf dieselbe Seite.
- [ ] GitHub Pages einmalig in den Repository-Einstellungen als Quelle für GitHub Actions aktivieren und Deploy prüfen.
- [ ] Veröffentlichte URL in App Store Connect eintragen: `https://onivue.github.io/onivoca-app/privacy.html`.
- [ ] Support-URL festlegen; Kontakt: `onivue@gmail.com`.

## 3. App Store Connect einrichten

- [ ] App-Eintrag für die Schweiz anlegen und Metadaten pflegen.
- [ ] Altersfreigabe wahrheitsgemäss ausfüllen; Kinder-Kategorie bewusst entscheiden.
- [ ] Datenschutzrichtlinien- und Support-URL eintragen.

## 4. App und Store-Material vorbereiten

- [ ] Vorläufiges `assets/icon.png` durch das finale App-Icon ersetzen.
- [ ] Echte iPhone-Screenshots und vollständige Store-Metadaten erstellen.

## 5. Produktionsbuild und TestFlight

- [ ] Apple-Signierung interaktiv in EAS einrichten. EAS-Projekt ist verknüpft; Zugangsdaten nicht im Repository speichern.
- [ ] Export-Compliance für den finalen Build prüfen. EAS meldet, dass `ios.infoPlist.ITSAppUsesNonExemptEncryption` noch fehlt.
- [ ] Produktionsbuild erstellen: `npx eas-cli@latest build --platform ios --profile production`.
- [ ] Build auf echten Geräten testen: Neuinstallation, Offline-Nutzung, Lernen, Sprachausgabe, Fortschritt, Zurücksetzen, VoiceOver und unterstützte iOS-Versionen.
- [ ] Datenschutzangaben in App Store Connect anhand des finalen Builds und aller SDKs beantworten.

## 6. Einreichen und veröffentlichen

- [ ] Review-Notizen zu Offline-Nutzung, lokalem Lernstand und fehlendem Login ergänzen.
- [ ] Nach erfolgreichem Test über App Store Connect oder `npx eas-cli@latest submit --platform ios` einreichen.
- [ ] Freigabe und Verfügbarkeit für die Schweiz bestätigen.

## Metadaten-Entwurf

- Name: Onivoca
- Untertitel: Englisch lernen mit Karten
- Sprache/Storefront: Deutsch / Schweiz
- Kategorie: Bildung
- Preis: kostenlos zum Start
- Zielgruppe: allgemeines Publikum; nicht gezielt für Kinder
- Beschreibung: Lerne englische Wörter und Wendungen mit Karten, Beispielen und iOS-Sprachausgabe. Bewerte Karten und verfolge deinen lokal gespeicherten Lernfortschritt – ohne Konto.
- Keywords: Englisch, Vokabeln, Karteikarten, Wortschatz, Deutsch, Lernen, Sprachausgabe
- Copyright erst eintragen, wenn die Rechteinhaberschaft bestätigt ist.

## Updates

- [ ] Version erhöhen und mit dem EAS-Profil `production` neu bauen; Buildnummer wird remote erhöht.
- [ ] Datenschutz, Berechtigungen und SDK-Verhalten für die Release-Version abgleichen.