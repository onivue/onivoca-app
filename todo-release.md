# App-Store-Release Schweiz

## Vor dem Einreichen

- [ ] Betreiberangaben liefern und in `src/app/privacy.tsx` einsetzen: verantwortliche Person/Firma, Postanschrift und Kontakt-E-Mail. Datenschutztext für das Schweizer DSG prüfen lassen; dieser Entwurf ist keine Rechtsberatung.
- [ ] Datenschutzerklärung unter einer dauerhaft öffentlich erreichbaren HTTPS-Adresse veröffentlichen und diese URL in App Store Connect als Datenschutzrichtlinie eintragen. Der In-App-Eintrag ist bereits im Tab «Fortschritt» vorhanden.
- [ ] Support-URL und erreichbare Support-Kontaktadresse für App Store Connect festlegen.
- [ ] Rechte und Nutzungsbedingungen des vorinstallierten Wortschatzes prüfen. Die Projektunterlagen nennen Google Translate als Quelle für Favoriten; klären, ob Übersetzungen und Beispiele kommerziell in der App weiterverwendet werden dürfen. Belege für erforderliche Lizenzen aufbewahren.
- [ ] Prüfen, ob App-Name «Onivoca» und Bundle-ID `com.onivoca.app` verfügbar sind und dem Rechteinhaber gehören. Die Bundle-ID nach dem ersten Store-Build nicht mehr ändern.
- [ ] In App Store Connect einen App-Eintrag anlegen und Schweizer Storefront, Name, Untertitel, Beschreibung, Keywords, Kategorie, Copyright und Preis/Verfügbarkeit festlegen. Deutsche Store-Metadaten und weitere Sprachen bei Bedarf separat pflegen.
- [ ] App-Datenschutzangaben in App Store Connect anhand des finalen Builds und aller eingebundenen SDKs beantworten. Aktuell ist im App-Code kein Entwickler-Backend, Analytics- oder Werbedienst erkennbar; bei zusätzlichen SDKs erneut prüfen.
- [ ] Altersfreigabe-Fragen wahrheitsgemäss beantworten und entscheiden, ob die App für Kinder beworben oder der Kids-Kategorie zugeordnet wird.
- [ ] App-Icon, Screenshots der echten App auf unterstützten iPhone-Grössen sowie vollständige, nicht platzhalterhafte Store-Metadaten bereitstellen.
- [ ] Vorhandensein und korrekte Deklaration der Rechte am App-Inhalt, an Schrift/Marke und an allen Store-Grafiken bestätigen.
- [ ] Export-Compliance/Encryption-Fragen in App Store Connect für den tatsächlich ausgelieferten Build beantworten. Keine Annahme oder Verschlüsselungs-Ausnahme ungeprüft setzen.
- [ ] Vollständigen iOS-Produktionsbuild mit `npx eas-cli@latest build --platform ios --profile production` erstellen. Dafür Expo-Konto, Apple Developer Program und gültige Signatur einrichten; Zugangsdaten nicht ins Repository schreiben.
- [ ] Build zuerst über TestFlight auf echten Geräten prüfen: Neuinstallation, Offline-Nutzung, Karten/Lernen, Sprachausgabe, Fortschritt, Zurücksetzen, VoiceOver und unterstützte iOS-Versionen.
- [ ] App-Review-Notizen mit Hinweisen zu Offline-Funktion, lokalem Lernstand und fehlendem Login ergänzen; die App enthält keine Demo-Zugangsdaten.
- [ ] Nach erfolgreicher Prüfung über App Store Connect oder `npx eas-cli@latest submit --platform ios` einreichen und die Freigabe für die Schweiz veröffentlichen.

## Vor jedem Update

- [ ] Version erhöhen und neuen Build über das EAS-Profil `production` erstellen; die Buildnummer wird automatisch remote erhöht.
- [ ] Datenschutzrichtlinie, Datenschutzangaben in App Store Connect, Berechtigungen und SDK-Verhalten gegen die konkrete Release-Version abgleichen.
