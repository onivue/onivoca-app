# App Store Connect: Angaben für onivoca 1.0.0

Alles, was du in [App Store Connect](https://appstoreconnect.apple.com) für den ersten Release ausfüllen musst, mit Vorschlägen zum Kopieren. Gilt für den Stand **mit Werbung** (AdMob-Anzeigenblock in [src/lib/ads.native.ts](../src/lib/ads.native.ts) eingetragen) und dem In-App-Kauf «Werbung entfernen». Die Schritte in AdMob und der Kauf stehen in [werbung-live-schalten.md](werbung-live-schalten.md).

Felder mit **⚠ Entscheid** brauchen eine Entscheidung von dir. Alle anderen Werte sind fertig vorgeschlagen.

## Was schon feststeht

| Was | Wert | Quelle |
|---|---|---|
| App-Name | onivoca | `app.json` |
| Bundle-ID | `ch.onivoca.app` | `app.json` |
| App-Store-Connect-App-ID | `6830894073` | `eas.json` (App-Eintrag existiert also bereits) |
| Version | 1.0.0 | `app.json` |
| Geräte | nur iPhone (`supportsTablet: false`) | `app.json` |
| Verschlüsselung | `ITSAppUsesNonExemptEncryption = false` | `app.json` |
| Entwickler | Albin Hoti, onivue@gmail.com | Datenschutzerklärung |
| Datenschutz-URL | https://onivue.github.io/onivoca-app/privacy.html | `src/app/privacy.tsx` |

---

## 1. Vor dem Ausfüllen

- [ ] **Datenschutzerklärung veröffentlichen.** `docs/privacy.html` ist lokal geändert, aber noch nicht gepusht. Apple prüft die URL, sie muss erreichbar sein. Nach dem Push unter «Settings → Pages» kontrollieren, dass die URL oben lädt.
- [ ] **Support-Seite veröffentlichen.** `docs/index.html` (Kontakt und Link zur Datenschutzerklärung) mit pushen. Sie erscheint dann unter `https://onivue.github.io/onivoca-app/`.
- [ ] **app-ads.txt:** Siehe [werbung-live-schalten.md](werbung-live-schalten.md), Schritt 6. Unter dem Unterpfad von GitHub Pages findet AdMob die Datei nicht. Ohne eigene Domain läuft die Werbung trotzdem, aber mit weniger Einnahmen.
- [ ] **Apple Developer Programm** aktiv und Vertrag «Free Apps» in App Store Connect unter *Verträge* akzeptiert. Der Vertrag «Paid Apps» ist erst für In-App-Käufe nötig.
- [ ] **Build hochgeladen** (siehe Abschnitt 12).
- [ ] **Screenshots erstellt** (siehe Abschnitt 5).

---

## 2. App-Informationen (links: *App-Informationen*)

| Feld | Eingabe |
|---|---|
| **Name** (max. 30 Zeichen) | `onivoca` |
| **Untertitel** (max. 30 Zeichen) | `Englisch & Spanisch lernen` (26 Zeichen) |
| **Primäre Sprache** | Deutsch |
| **Bundle-ID** | `ch.onivoca.app` (bereits gewählt) |
| **SKU** | Interne Kennung, nur für dich sichtbar. Beim App-Eintrag schon vergeben. Falls leer: `onivoca-ios` |
| **Kategorie primär** | Bildung |
| **Kategorie sekundär** | Nachschlagewerke (optional) |
| **Inhaltsrechte** | «Nein», die App enthält oder nutzt keine Inhalte von Dritten. Die Lernkarten sind eigene Inhalte. |
| **Altersfreigabe** | siehe Abschnitt 7 |

Andere Untertitel zur Auswahl:

- `Vokabeln mit Karteikarten` (25)
- `Wörter und Sätze trainieren` (27)

---

## 3. Preise und Verfügbarkeit (links: *Preise und Verfügbarkeit*)

| Feld | Eingabe |
|---|---|
| **Preis** | CHF 0 (Stufe «Kostenlos») |
| **Verfügbarkeit** | **⚠ Entscheid:** Die Oberfläche ist komplett deutsch. Sinnvoll sind Schweiz, Deutschland, Österreich, Liechtenstein, Luxemburg. Alle Länder sind aber auch möglich. |
| **Vorbestellung** | Aus |
| **Apple Silicon Macs / Vision Pro** | Wähle für beides «Nicht verfügbar machen», wenn du die App dort nicht testen willst. Sonst erscheint sie automatisch dort. |

---

## 4. Version 1.0 (links: *iOS-App → 1.0 Release vorbereiten*)

### Texte (Deutsch)

**Werbetext** (max. 170 Zeichen, jederzeit änderbar, ohne neue Version):

```
Englisch und Spanisch lernen, ganz ohne Konto: Karteikarten, Aussprache und ein Lernstand, der auf deinem iPhone bleibt.
```

**Beschreibung** (max. 4000 Zeichen):

```
onivoca ist eine ruhige Lernkarten-App für Englisch und Spanisch. Du lernst in kurzen Runden, ohne Termine, ohne Konto und ohne Druck.

SO FUNKTIONIERT ES
Eine Karte zeigt dir ein Wort oder einen Satz. Tippe darauf, um sie umzudrehen und die deutsche Bedeutung samt Beispielen zu sehen. Dann sagst du, wie gut du es wusstest: Nochmal, Gut oder Einfach. onivoca merkt sich das und zeigt dir Schwieriges öfter.

DAS STECKT DRIN
• Englisch: über 600 Wörter mit Aussprache, deutscher Bedeutung, Beispielsätzen und verwandten Wörtern
• Spanisch: 160 Wörter und rund 6000 Satzkarten
• Aussprache zum Anhören per Tipp auf das Lautsprecher-Symbol
• Schwierigkeitsmix: Du bestimmst, wie viele leichte und schwere Karten in eine Runde kommen
• Zusammenfassung nach jeder Runde
• Detailseite zu jedem Wort mit Verlauf
• Fortschritt: Was du gelernt hast und was noch offen ist
• Helles und dunkles Erscheinungsbild

PRIVAT
Dein Lernstand bleibt auf deinem Gerät. Du brauchst kein Konto, onivoca sammelt keine Daten und verwendet keine Analysedienste.

Fragen oder Wünsche? Schreib an onivue@gmail.com.
```

Vor dem Einfügen kurz gegen die App prüfen: Die Zahlen stammen aus `src/data/words/` (608 englische Wörter, 160 spanische Wörter, 5976 spanische Sätze). Wenn du Wörter ergänzt, die Zahlen anpassen.

**Schlüsselwörter** (max. 100 Zeichen, durch Komma, ohne Leerzeichen):

```
Vokabeln,Karteikarten,Wortschatz,Vokabeltrainer,Lernkarten,Aussprache,Sätze,Sprachen,Wörter
```

91 Zeichen. «Englisch», «Spanisch», «lernen» und «Bildung» stehen schon in Name, Untertitel und Kategorie und werden von Apple automatisch mitgesucht, deshalb fehlen sie hier.

**Was ist neu in dieser Version:** Bei der ersten Version nicht nötig. Für spätere Updates z. B. «Verbesserungen und Fehlerbehebungen».

### Links und Rechtliches

| Feld | Eingabe |
|---|---|
| **Support-URL** (Pflicht) | `https://onivue.github.io/onivoca-app/` |
| **Marketing-URL** (optional) | Mit eigener Domain (z. B. `https://onivoca.ch`) diese eintragen, dort sucht AdMob die `app-ads.txt`. Sonst leer lassen. |
| **Copyright** | `2026 Albin Hoti` |

### Build

Unter *Build → Build hinzufügen* den von EAS hochgeladenen Build auswählen. Er erscheint erst nach der Verarbeitung durch Apple (meist 10 bis 30 Minuten). Falls die Exportvorschriften-Frage erscheint: Sie ist durch `ITSAppUsesNonExemptEncryption = false` bereits beantwortet.

### Release-Art

| Option | Wann |
|---|---|
| **Manuell veröffentlichen** | **Empfohlen für 1.0.** Nach der Freigabe drückst du selbst auf «Veröffentlichen». |
| Automatisch | Geht sofort nach der Freigabe live. |
| Zeitpunkt | Fixes Datum. |

«Phased Release» (schrittweise Auslieferung) gilt nur für Updates, nicht für 1.0.

---

## 5. Screenshots und Vorschau

Die App läuft nur auf dem iPhone, daher **keine iPad-Screenshots**.

| Gerät | Grösse | Anzahl |
|---|---|---|
| **iPhone 6.9"** (Pflicht) | 1320 × 2868 px (Hochformat) | 3 bis 10 |

Apple skaliert die Screenshots für kleinere iPhone-Grössen automatisch herunter. Falls App Store Connect zusätzlich 6.5" verlangt: 1284 × 2778 px.

Vorschlag für 5 Motive (Reihenfolge = Reihenfolge im Store):

1. Lernen: Karteikarte, Vorderseite
2. Lernen: aufgedeckte Rückseite mit Bedeutung und Beispiel
3. Rundenzusammenfassung nach einer Runde
4. Wörter: Liste aller Karten
5. Einstellungen: Schwierigkeitsmix

Aufnehmen: Simulator **iPhone 17 Pro Max** (bzw. grösstes verfügbares Modell), `⌘S` speichert einen Screenshot auf dem Schreibtisch. Alternativ auf dem eigenen iPhone und die Grösse prüfen. Screenshots dürfen keine Statusleisten-Fehler (leerer Akku, «Kein Netz») zeigen.

**App-Vorschau (Video):** optional, weglassen.

**App-Symbol:** Wird mit dem Build mitgeliefert (`assets/icon.png`, 1024 × 1024, ohne Transparenz). Nichts hochzuladen.

---

## 6. App-Datenschutz (links: *App-Datenschutz*)

Mit Werbung (AdMob) und IDFA-Abfrage:

| Feld | Eingabe |
|---|---|
| **Datenschutzrichtlinie (URL)** | `https://onivue.github.io/onivoca-app/privacy.html` |
| **Datenerfassung** | «Ja, wir erfassen Daten von dieser App» und die Tabelle unten ausfüllen |
| **Datenschutz-Optionen-URL** | leer |

| Datentyp | Zweck | Mit Nutzer verknüpft | Für Tracking |
|---|---|---|---|
| Kennungen → Geräte-ID | Werbung von Drittanbietern | Nein | Ja |
| Nutzungsdaten → Produktinteraktion, Werbedaten | Werbung von Drittanbietern, Analyse | Nein | Ja |
| Standort → Ungefährer Standort (über IP) | Werbung von Drittanbietern | Nein | Ja |
| Diagnose → Absturzdaten, Leistungsdaten | Analyse | Nein | Nein |
| Käufe → Kaufverlauf | App-Funktionalität | Nein | Nein |

Beim Einreichen fragt App Store Connect nach der Werbe-ID (IDFA): **Ja**, Zweck «Werbung in der App schalten». Die Optionen zur Zuordnung von Installationen oder Aktionen bleiben leer, die App misst keine Installationen.

Die Datenschutzerklärung deckt Werbung und Kauf bereits ab.

---

## 7. Altersfreigabe (*App-Informationen → Altersfreigabe → Bearbeiten*)

Der Fragebogen fragt Merkmale ab. Vorschlag für onivoca:

| Frage | Antwort |
|---|---|
| In-App-Steuerung: Kindersicherung / Altersüberprüfung | Nein |
| Funktionen: Uneingeschränkter Webzugriff | Nein |
| Funktionen: Nutzergenerierte Inhalte | Nein |
| Funktionen: Nachrichten / Chat | Nein |
| Funktionen: **Werbung** | **Ja** |
| Medizinische / Gesundheitsthemen | Keine |
| Sexuelle Inhalte, Nacktheit | Keine |
| Gewalt (realistisch, Cartoon, Waffen) | Keine |
| Horror / Gruselthemen | Keine |
| Alkohol, Tabak, Drogen | Keine |
| Glücksspiel, simuliertes Glücksspiel, Wetten, Lotterien | Keine |
| Mature / suggestive Themen | Keine |
| **Vulgäre Sprache / Schimpfwörter** | **⚠ Entscheid:** Die englischen Wörterbucheinträge enthalten einzelne markierte Ausdrücke (z. B. «screw you» als *vulgar*, «imbecile» und «moron» als *slang*). Es sind erklärte Lerninhalte, kein Schimpfen in der App. Empfehlung: **Keine**. Wer ganz sicher gehen will, wählt «Selten», das kann die Einstufung erhöhen. |

Erwartetes Ergebnis: 4+ (mit Werbung kann die Einstufung höher ausfallen, Apple zeigt das Ergebnis vor dem Speichern an). Zusätzlich fragt Apple nach der Altersgruppe, die du erlaubst; belasse die vorgeschlagene Einstufung.

---

## 8. Compliance-Angaben (*App-Informationen* und beim Einreichen)

| Thema | Eingabe |
|---|---|
| **Exportvorschriften / Verschlüsselung** | Schon im Build gesetzt, keine Frage mehr. Falls sie doch kommt: Nutzt nur Standard-Verschlüsselung (HTTPS/Betriebssystem), ausgenommen. |
| **Digital Services Act (EU): Händlerstatus** | **⚠ Entscheid:** In der EU musst du erklären, ob du «Händler» (Trader) bist. Planst du Werbung und In-App-Kauf, giltst du in der Regel als Händler. Dann zeigt Apple deinen **Namen, deine Adresse, Telefonnummer und E-Mail öffentlich** in der Produktseite. Wenn dir das nicht passt, eine Geschäftsadresse oder Postfach-Dienst hinterlegen. Ohne diese Erklärung ist die App in der EU nicht erhältlich. |
| **Inhalte Dritter** | Nein (siehe Abschnitt 2). |
| **Tracking (ATT)** | Die App zeigt den ATT-Dialog nach dem Einwilligungsdialog. Der Text steht in `app.json` beim Plugin `expo-tracking-transparency`. |

---

## 9. App-Review-Informationen (*Version → App-Review-Informationen*)

| Feld | Eingabe |
|---|---|
| **Anmeldung erforderlich** | Nein (kein Konto in der App) |
| **Vorname / Nachname** | Albin / Hoti |
| **Telefonnummer** | **⚠ Entscheid:** deine Nummer mit Landesvorwahl (+41 …). Pflichtfeld, nur für Apple sichtbar. |
| **E-Mail** | onivue@gmail.com |
| **Notizen** | siehe unten |
| **Anhang** | nicht nötig |

Vorschlag für die Notizen:

```
onivoca ist eine Lernkarten-App für Englisch und Spanisch. Es gibt kein Benutzerkonto, keine Anmeldung und keine Server-Verbindung. Alle Lerninhalte sind in der App enthalten und funktionieren offline. Karte antippen dreht sie um, das Lautsprecher-Symbol spielt die Aussprache mit der iOS-Sprachausgabe ab. Die Sprache (Englisch/Spanisch) lässt sich im Tab «Lernen» wechseln.
```

---

## 10. Weitere Felder, die du überspringen kannst

- **TestFlight → Testinformationen:** nur nötig für externe Tester.
- **In-App-Käufe:** Nicht überspringen, siehe Abschnitt 10a.
- **App Clips, Game Center, Sticker, Apple Pay:** nicht verwendet.
- **Lokalisierungen:** nur Deutsch nötig. Optional Englisch (Schweiz/Welt) ergänzen, dann denselben Aufbau mit englischen Texten.
- **Tarif / Steuern / Bank:** erst für bezahlte Apps und In-App-Käufe nötig.

---

## 10a. In-App-Kauf «Werbung entfernen»

Muss **vor** dem Einreichen angelegt und der Version hinzugefügt werden. Vorher *Verträge, Steuern und Bankverbindung → Paid Apps* akzeptieren und Bank/Steuern ausfüllen, sonst lädt die App keinen Preis.

*Monetarisierung → In-App-Käufe → +*

| Feld | Eingabe |
|---|---|
| Typ | Nicht-verbrauchbar |
| Referenzname | Werbung entfernen |
| Produkt-ID | `ch.onivoca.app.remove_ads` (exakt so) |
| Preis | **⚠ Entscheid**, z. B. CHF 3.00 |
| Anzeigename (Deutsch) | Werbung entfernen |
| Beschreibung (Deutsch) | Entfernt die Werbung in onivoca dauerhaft. Einmal kaufen, für immer werbefrei. |
| Screenshot für die Prüfung | Einstellungen mit dem Bereich «Werbung» und dem Kaufknopf |
| Prüfungsnotiz | Siehe unten |

Danach in der Version unter *In-App-Käufe und Abonnements* das Produkt hinzufügen. Zum Testen unter *Benutzer und Zugriff → Sandbox* einen Sandbox-Tester anlegen.

Zusätzlich in die **Review-Notizen** (Abschnitt 9) anfügen:

```
Die App zeigt nach jeder abgeschlossenen Lernrunde eine Vollbild-Werbung (Google AdMob). Der In-App-Kauf «Werbung entfernen» und «Käufe wiederherstellen» befinden sich unter Einstellungen. Beim ersten Start erscheint zuerst der Einwilligungsdialog von Google, danach der Apple-Tracking-Dialog.
```

---

## 11. Checkliste vor «Zur Prüfung hinzufügen»

- [ ] Datenschutz-URL und Support-URL laden im Browser
- [ ] AdMob: Einwilligungsmitteilung veröffentlicht, App mit dem Store verknüpft (nach Livegang)
- [ ] In-App-Kauf angelegt und der Version hinzugefügt
- [ ] Name, Untertitel, Beschreibung, Schlüsselwörter, Werbetext eingetragen
- [ ] Kategorie Bildung gewählt
- [ ] Mindestens 3 Screenshots (6.9") hochgeladen
- [ ] Build ausgewählt
- [ ] Preis CHF 0 und Länder gesetzt
- [ ] App-Datenschutz mit Werbedaten veröffentlicht
- [ ] Altersfreigabe ausgefüllt
- [ ] DSA-Händlerstatus erklärt
- [ ] Review-Kontakt mit Telefonnummer ausgefüllt
- [ ] Release-Art gewählt (empfohlen: manuell)
- [ ] Auf TestFlight einmal durchgespielt: Lernrunde, Sprachwechsel, Aussprache, Einstellungen, Dunkelmodus

---

## 12. Befehle

```bash
# 1. Prüfen
npx tsc --noEmit
npx expo lint
npx expo-doctor

# 2. Bauen (Buildnummer zählt EAS automatisch hoch)
npx eas-cli@latest build --platform ios --profile production

# 3. Zu App Store Connect hochladen (App-ID 6830894073 steht in eas.json)
npx eas-cli@latest submit --platform ios --profile production --latest
```

Danach: Build in App Store Connect abwarten → bei der Version auswählen → *Zur Prüfung hinzufügen* → *An App Review senden*. Die Prüfung dauert meist 24 bis 48 Stunden. Bei einer Ablehnung steht der Grund im *Resolution Center*; antworte dort direkt.

Werbung und Kauf brauchen einen neuen nativen Build, ein OTA-Update reicht nicht.
