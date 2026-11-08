# App Store Connect: Angaben für onivoca 1.0.0

Alles, was du in [App Store Connect](https://appstoreconnect.apple.com) für den ersten Release ausfüllen musst, mit Vorschlägen zum Kopieren und dem genauen Ort jedes Felds. Gilt für den Stand **mit Werbung** (AdMob-Anzeigenblock in [src/lib/ads.native.ts](../src/lib/ads.native.ts) eingetragen) und dem In-App-Kauf «Werbung entfernen». Die Schritte in AdMob stehen in [werbung-live-schalten.md](werbung-live-schalten.md).

Felder mit **⚠ Entscheid** brauchen eine Entscheidung von dir. Alle anderen Werte sind fertig vorgeschlagen. Die Menünamen sind die deutschen Namen der Oberfläche; Apple benennt gelegentlich um, dann hilft die Suche im Browser (`⌘F`).

## Wo finde ich was? (Orientierung)

Alles zur App beginnt hier: [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **Apps** → **onivoca**. Links erscheint die Seitenleiste. Es gibt vier Orte, an denen du Angaben machst:

| Ort | So kommst du hin | Hier steht |
|---|---|---|
| **A. Version** | Seitenleiste → **iOS-App** → **1.0 Release vorbereiten** | Screenshots, Werbetext, Beschreibung, Schlüsselwörter, Support-/Marketing-URL, Copyright, Build, In-App-Käufe der Version, App-Review-Informationen, Release-Art |
| **B. App-Informationen** | Seitenleiste → **Allgemein** → **App-Informationen** | Name, Untertitel, Kategorien, Inhaltsrechte, Altersfreigabe, Bundle-ID, SKU |
| **C. Preise und Verfügbarkeit** | Seitenleiste → **Allgemein** → **Preise und Verfügbarkeit** | Preis, Länder |
| **D. App-Datenschutz** | Seitenleiste → **Allgemein** → **App-Datenschutz** | Datenschutz-Angaben und -URL |

Dazu kommen Orte ausserhalb der App-Seite:

| Ort | So kommst du hin |
|---|---|
| **In-App-Käufe** | Seitenleiste → **Monetarisierung** → **In-App-Käufe** |
| **Verträge** | Startseite von App Store Connect → **Verträge** (bei neuerer Oberfläche: **Business**) |
| **Sandbox-Tester** | Startseite → **Benutzer und Zugriff** → Reiter **Sandbox** |
| **TestFlight** | Oben in der App-Seite → Reiter **TestFlight** |

Wichtig: Jede Seite hat oben rechts den Knopf **Sichern**. Ohne Sichern gehen Änderungen verloren.

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

- [ ] **Datenschutzerklärung veröffentlichen.** `docs/privacy.html` ist lokal geändert, aber noch nicht gepusht. Apple prüft die URL, sie muss erreichbar sein. Nach dem Push auf GitHub unter *Settings → Pages* kontrollieren, dass die URL oben lädt.
- [ ] **Support-Seite veröffentlichen.** `docs/index.html` (Kontakt und Link zur Datenschutzerklärung) mit pushen. Sie erscheint dann unter `https://onivue.github.io/onivoca-app/`.
- [ ] **app-ads.txt:** Siehe [werbung-live-schalten.md](werbung-live-schalten.md), Schritt 6. Unter dem Unterpfad von GitHub Pages findet AdMob die Datei nicht. Ohne eigene Domain läuft die Werbung trotzdem, aber mit weniger Einnahmen.
- [ ] **Verträge:** Auf der Startseite von App Store Connect unter **Verträge** (bzw. **Business**) den Vertrag **Kostenlose Apps** akzeptieren. Für den In-App-Kauf zusätzlich **Kostenpflichtige Apps** akzeptieren und Bankverbindung sowie Steuerformulare ausfüllen (siehe Abschnitt 10a).
- [ ] **Build hochgeladen** (siehe Abschnitt 12).
- [ ] **Screenshots erstellt** (siehe Abschnitt 5).

---

## 2. App-Informationen

**Wo:** Seitenleiste → **Allgemein** → **App-Informationen** (Ort B). Rechts oben **Sichern**.

| Feld | Eingabe | Wo auf der Seite |
|---|---|---|
| **Name** (max. 30 Zeichen) | `onivoca` | Abschnitt «Lokalisierbare Informationen» (Sprache Deutsch) |
| **Untertitel** (max. 30 Zeichen) | `Englisch & Spanisch lernen` (26 Zeichen) | ebenda |
| **Primäre Sprache** | Deutsch | Abschnitt «Allgemeine Informationen» |
| **Bundle-ID** | `ch.onivoca.app` (bereits gewählt, nicht änderbar) | ebenda |
| **SKU** | Interne Kennung, nur für dich sichtbar, beim App-Eintrag schon vergeben. Falls leer: `onivoca-ios` | ebenda |
| **Kategorie primär** | Bildung | Abschnitt «Kategorie» |
| **Kategorie sekundär** | Nachschlagewerke (optional) | ebenda |
| **Inhaltsrechte** | «Nein», die App enthält oder nutzt keine Inhalte von Dritten. Die Lernkarten sind eigene Inhalte. | Abschnitt «Inhaltsrechte», Knopf **Einrichten** |
| **Altersfreigabe** | siehe Abschnitt 7 | Abschnitt «Altersfreigabe», Knopf **Bearbeiten** |

Andere Untertitel zur Auswahl:

- `Vokabeln mit Karteikarten` (25)
- `Wörter und Sätze trainieren` (27)

---

## 3. Preise und Verfügbarkeit

**Wo:** Seitenleiste → **Allgemein** → **Preise und Verfügbarkeit** (Ort C).

| Feld | Eingabe | Wo auf der Seite |
|---|---|---|
| **Preis** | CHF 0 (Stufe «Kostenlos») | Abschnitt «Preisplan» → **Preis hinzufügen** bzw. Basisland Schweiz mit Preis 0 wählen |
| **Verfügbarkeit** | **⚠ Entscheid:** Die Oberfläche ist komplett deutsch. Sinnvoll sind Schweiz, Deutschland, Österreich, Liechtenstein, Luxemburg. Alle Länder sind aber auch möglich. | Abschnitt «Verfügbarkeit» → **Länder oder Regionen bearbeiten** |
| **Vorbestellung** | Aus | Abschnitt «Vorbestellungen» (Standard) |
| **Apple Silicon Macs / Vision Pro** | Für beides «Nicht verfügbar machen», wenn du die App dort nicht testen willst. Sonst erscheint sie automatisch dort. | Abschnitt «Verfügbarkeit auf Apple Silicon Macs und Apple Vision Pro» |

---

## 4. Version 1.0

**Wo:** Seitenleiste → **iOS-App** → **1.0 Release vorbereiten** (Ort A). Alle Felder dieses Abschnitts stehen auf dieser einen Seite, von oben nach unten: Screenshots → Werbetext → Beschreibung → Schlüsselwörter → Support-/Marketing-URL → Version → Copyright → Build → App-Review-Informationen → Release-Art. Oben rechts **Sichern**.

Falls es die Sprache Deutsch noch nicht gibt, oben bei der Sprachauswahl **Deutsch** als Sprache anlegen. Die Texte unten gehören in diese Sprache.

### Texte (Deutsch)

**Werbetext** (Feld «Werbetext», max. 170 Zeichen, jederzeit änderbar, ohne neue Version):

```
Englisch und Spanisch lernen, ganz ohne Konto: Karteikarten, Aussprache und ein Lernstand, der auf deinem iPhone bleibt.
```

**Beschreibung** (Feld «Beschreibung», max. 4000 Zeichen):

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
Dein Lernstand bleibt auf deinem Gerät. Du brauchst kein Konto und onivoca verwendet keine Analysedienste. Die kostenlose Version zeigt Werbung, die du mit einem einmaligen Kauf entfernen kannst.

Fragen oder Wünsche? Schreib an onivue@gmail.com.
```

Vor dem Einfügen kurz gegen die App prüfen: Die Zahlen stammen aus `src/data/words/` (608 englische Wörter, 160 spanische Wörter, 5976 spanische Sätze). Wenn du Wörter ergänzt, die Zahlen anpassen.

**Schlüsselwörter** (Feld «Schlüsselwörter», max. 100 Zeichen, durch Komma, ohne Leerzeichen):

```
Vokabeln,Karteikarten,Wortschatz,Vokabeltrainer,Lernkarten,Aussprache,Sätze,Sprachen,Wörter
```

91 Zeichen. «Englisch», «Spanisch», «lernen» und «Bildung» stehen schon in Name, Untertitel und Kategorie und werden von Apple automatisch mitgesucht, deshalb fehlen sie hier.

**Was ist neu in dieser Version** (Feld «Neuerungen»): Bei der ersten Version nicht nötig, das Feld erscheint erst bei Updates. Dann z. B. «Verbesserungen und Fehlerbehebungen».

### Links und Rechtliches

Alle drei Felder stehen weiter unten auf derselben Versionsseite, im Block «Version-Informationen».

| Feld | Eingabe |
|---|---|
| **Support-URL** (Pflicht) | `https://onivue.github.io/onivoca-app/` |
| **Marketing-URL** (optional) | Mit eigener Domain (z. B. `https://onivoca.ch`) diese eintragen, dort sucht AdMob die `app-ads.txt`. Sonst leer lassen. |
| **Copyright** | `2026 Albin Hoti` |

### Build

**Wo:** Versionsseite, Abschnitt **Build** → **Build hinzufügen** (blauer Plus-Knopf). Der von EAS hochgeladene Build erscheint erst nach der Verarbeitung durch Apple (meist 10 bis 30 Minuten) in der Liste. Wähle den neuesten. Falls die Exportvorschriften-Frage erscheint: Sie ist durch `ITSAppUsesNonExemptEncryption = false` bereits beantwortet.

### Release-Art

**Wo:** Versionsseite ganz unten, Abschnitt **Version veröffentlichen**.

| Option | Wann |
|---|---|
| **Diese Version manuell veröffentlichen** | **Empfohlen für 1.0.** Nach der Freigabe drückst du selbst auf «Diese Version veröffentlichen». |
| Automatisch nach Freigabe | Geht sofort nach der Freigabe live. |
| Automatisch ab einem Datum | Fixes Datum. |

«Phased Release» (schrittweise Auslieferung) gilt nur für Updates, nicht für 1.0.

---

## 5. Screenshots und Vorschau

**Wo:** Versionsseite (Ort A), ganz oben im Block «Vorschauen und Screenshots» (Reiter **iPhone**). Dateien per Drag & Drop in das 6.9"-Feld ziehen.

Die App läuft nur auf dem iPhone, daher **keine iPad-Screenshots**.

App Store Connect hat pro Grössen-Slot nur genau bestimmte Masse. Sind sie falsch, kommt «File dimensions are invalid». Das Skript erzeugt deshalb beide Grössen:

| Slot in App Store Connect | Grösse | Ordner | Anzahl |
|---|---|---|---|
| **iPhone 6.9"** | 1320 × 2868 px | `store-screenshots/6.9/dark` bzw. `light` | 3 bis 10 |
| **iPhone 6.1" / 6.3"** | 1206 × 2622 px | `store-screenshots/6.3/dark` bzw. `light` | 3 bis 10 |

Es genügt **ein** Slot, den Apple verlangt (derzeit der grösste, 6.9"); Apple skaliert für die anderen iPhones. Hat die Seite nur den 6.1"/6.3"-Slot, nimm den Ordner `6.3`. Nicht Hochformat-Bilder in Querformat-Slots (Vision Pro, Mac) ziehen. Neu erzeugen: `npm run screenshots:compose`.

Vorschlag für 5 Motive (Reihenfolge = Reihenfolge im Store, per Drag & Drop änderbar):

1. Lernen: Karteikarte, Vorderseite
2. Lernen: aufgedeckte Rückseite mit Bedeutung und Beispiel
3. Rundenzusammenfassung nach einer Runde
4. Wörter: Liste aller Karten
5. Einstellungen: Schwierigkeitsmix

Aufnehmen: Simulator **iPhone 17 Pro Max** (bzw. grösstes verfügbares Modell), `⌘S` speichert einen Screenshot auf dem Schreibtisch. Alternativ auf dem eigenen iPhone und die Grösse prüfen. Screenshots dürfen keine Statusleisten-Fehler (leerer Akku, «Kein Netz») zeigen.

**App-Vorschau (Video):** optional, weglassen.

**App-Symbol:** Wird mit dem Build mitgeliefert (`assets/icon.png`, 1024 × 1024, ohne Transparenz). Nichts hochzuladen.

---

## 6. App-Datenschutz

**Wo:** Seitenleiste → **Allgemein** → **App-Datenschutz** (Ort D). Dort ganz oben «Datenschutzrichtlinie» → **Bearbeiten**, weiter unten «Datenschutzangaben» → **Los geht's** bzw. **Bearbeiten**. Am Ende **Veröffentlichen** drücken, sonst sieht Apple die Angaben nicht.

Mit Werbung (AdMob) und IDFA-Abfrage:

| Feld | Eingabe |
|---|---|
| **Datenschutzrichtlinie (URL)** | `https://onivue.github.io/onivoca-app/privacy.html` |
| **Datenerfassung** | «Ja, wir erfassen Daten von dieser App» und die Tabelle unten ausfüllen |
| **Datenschutz-Optionen-URL** | leer |

Im Assistenten wählst du die Datentypen links aus und beantwortest dann je Typ die drei Fragen (Zweck, mit Nutzer verknüpft, für Tracking):

| Datentyp | Zweck | Mit Nutzer verknüpft | Für Tracking |
|---|---|---|---|
| Kennungen → Geräte-ID | Werbung von Drittanbietern | Nein | Ja |
| Nutzungsdaten → Produktinteraktion, Werbedaten | Werbung von Drittanbietern, Analyse | Nein | Ja |
| Standort → Ungefährer Standort (über IP) | Werbung von Drittanbietern | Nein | Ja |
| Diagnose → Absturzdaten, Leistungsdaten | Analyse | Nein | Nein |
| Käufe → Kaufverlauf | App-Funktionalität | Nein | Nein |

**IDFA-Frage:** Beim Absenden zur Prüfung (Abschnitt 11, «Zur Prüfung hinzufügen») erscheint ein Dialog «Verwendet diese App die Werbe-ID (IDFA)?». Antwort **Ja**, Zweck «Werbung in der App schalten». Die Optionen zur Zuordnung von Installationen oder Aktionen bleiben leer, die App misst keine Installationen.

Die Datenschutzerklärung deckt Werbung und Kauf bereits ab.

---

## 7. Altersfreigabe

**Wo:** Seitenleiste → **Allgemein** → **App-Informationen** (Ort B), Abschnitt «Altersfreigabe» → **Bearbeiten**. Es öffnet sich ein Fragebogen. Am Ende zeigt Apple das Ergebnis und du bestätigst mit **Sichern**.

Vorschlag für onivoca:

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

## 8. Compliance-Angaben

Diese Angaben stehen an drei verschiedenen Orten:

| Thema | Wo | Eingabe |
|---|---|---|
| **Exportvorschriften / Verschlüsselung** | Beim Build (Versionsseite → Abschnitt Build) | Schon im Build gesetzt, keine Frage mehr. Falls sie doch kommt: Nutzt nur Standard-Verschlüsselung (HTTPS/Betriebssystem), ausgenommen. |
| **Digital Services Act (EU): Händlerstatus** | Startseite von App Store Connect → **Verträge** (bzw. **Business**) → **Compliance** → **Digital Services Act**. Sonst zeigt die App-Seite oben ein gelbes Banner mit Link. | **⚠ Entscheid:** In der EU musst du erklären, ob du «Händler» (Trader) bist. Mit Werbung und In-App-Kauf giltst du in der Regel als Händler. Dann zeigt Apple deinen **Namen, deine Adresse, Telefonnummer und E-Mail öffentlich** auf der Produktseite. Wenn dir das nicht passt, eine Geschäftsadresse oder einen Postfach-Dienst hinterlegen. Ohne diese Erklärung ist die App in der EU nicht erhältlich. |
| **Inhalte Dritter** | Seitenleiste → **App-Informationen** → «Inhaltsrechte» | Nein (siehe Abschnitt 2). |
| **Tracking (ATT)** | kein Feld in App Store Connect | Die App zeigt den ATT-Dialog nach dem Einwilligungsdialog. Der Text steht in `app.json` beim Plugin `expo-tracking-transparency`. |

---

## 9. App-Review-Informationen

**Wo:** Versionsseite (Ort A), weiter unten im Block **App-Review-Informationen**. Oben rechts **Sichern**.

| Feld | Eingabe |
|---|---|
| **Anmeldung erforderlich** | Haken **nicht** setzen (kein Konto in der App) |
| **Vorname / Nachname** | Albin / Hoti |
| **Telefonnummer** | **⚠ Entscheid:** deine Nummer mit Landesvorwahl (+41 …). Pflichtfeld, nur für Apple sichtbar. |
| **E-Mail** | onivue@gmail.com |
| **Hinweise** | siehe unten |
| **Anhang** | nicht nötig |

Text für das Feld **Hinweise** (inklusive Werbung und Kauf, damit Apple alles findet):

```
onivoca ist eine Lernkarten-App für Englisch und Spanisch. Es gibt kein Benutzerkonto, keine Anmeldung und keinen eigenen Server. Alle Lerninhalte sind in der App enthalten und funktionieren offline. Karte antippen dreht sie um, das Lautsprecher-Symbol spielt die Aussprache mit der iOS-Sprachausgabe ab. Die Sprache (Englisch/Spanisch) lässt sich im Tab «Lernen» wechseln.

Die App zeigt nach jeder abgeschlossenen Lernrunde eine Vollbild-Werbung (Google AdMob). Der In-App-Kauf «Werbung entfernen» und «Käufe wiederherstellen» befinden sich unter Einstellungen. Beim ersten Start erscheint zuerst der Einwilligungsdialog von Google, danach der Apple-Tracking-Dialog.
```

---

## 10. Weitere Felder, die du überspringen kannst

- **TestFlight → Testinformationen:** nur nötig für externe Tester (Reiter **TestFlight**).
- **App Clips, Game Center, Sticker, Apple Pay:** nicht verwendet.
- **Lokalisierungen:** nur Deutsch nötig. Optional Englisch (Schweiz/Welt) ergänzen: Versionsseite → Sprachauswahl oben → **Sprache hinzufügen**, dann denselben Aufbau mit englischen Texten.
- **In-App-Käufe:** Nicht überspringen, siehe Abschnitt 10a.

---

## 10a. In-App-Kauf «Werbung entfernen»

Muss **vor** dem Einreichen angelegt und der Version hinzugefügt werden.

**Schritt 1: Vertrag und Bank.** Startseite von App Store Connect → **Verträge** (bzw. **Business**) → Vertrag **Kostenpflichtige Apps** akzeptieren, Bankverbindung und Steuerformulare ausfüllen. Ohne ihn lädt die App keinen Preis.

**Schritt 2: Kauf anlegen.** Seitenleiste → **Monetarisierung** → **In-App-Käufe** → blauer **+**-Knopf.

| Feld | Eingabe |
|---|---|
| Typ | Nicht-verbrauchbar |
| Referenzname | Werbung entfernen (nur für dich sichtbar) |
| Produkt-ID | `ch.onivoca.app.remove_ads` (exakt so, später nicht änderbar) |
| Preis | **⚠ Entscheid**, z. B. CHF 3.00. Eintragen unter **Preisplan** des Kaufs. |
| Verfügbarkeit | Dieselben Länder wie die App |
| Anzeigename (Deutsch) | Werbung entfernen (unter **Lokalisierung der App Store-Informationen**) |
| Beschreibung (Deutsch) | Entfernt die Werbung in onivoca dauerhaft. Einmal kaufen, für immer werbefrei. |
| Screenshot für die Prüfung | Einstellungen mit dem Bereich «Werbung» und dem Kaufknopf (unter **Informationen zur Überprüfung**) |
| Hinweise zur Prüfung | z. B. «Kauf unter Einstellungen → Werbung» |

Der Status muss auf **Bereit zum Senden** stehen.

**Schritt 3: Der Version hinzufügen.** Versionsseite (Ort A) → Block **In-App-Käufe und Abonnements** → **+** → «Werbung entfernen» auswählen. Der erste In-App-Kauf wird nur zusammen mit einer App-Version geprüft.

**Schritt 4: Testen.** Startseite → **Benutzer und Zugriff** → Reiter **Sandbox** → Sandbox-Tester anlegen. Auf dem iPhone unter Einstellungen → App Store (ganz unten, «Sandbox-Konto») mit ihm anmelden.

Die Hinweise für die Prüfung stehen schon im Text von Abschnitt 9.

---

## 11. Checkliste vor «Zur Prüfung hinzufügen»

**Wo:** Versionsseite (Ort A), oben rechts **Zur Prüfung hinzufügen**. Fehlt etwas, zeigt App Store Connect die Felder rot an.

- [ ] Datenschutz-URL und Support-URL laden im Browser
- [ ] AdMob: Einwilligungsmitteilung veröffentlicht (Ort: AdMob, nicht App Store Connect), App nach Livegang mit dem Store verknüpft
- [ ] In-App-Kauf angelegt, Status «Bereit zum Senden», der Version hinzugefügt (Abschnitt 10a)
- [ ] Name, Untertitel, Kategorie, Altersfreigabe in **App-Informationen** (Abschnitte 2 und 7)
- [ ] Preis CHF 0 und Länder in **Preise und Verfügbarkeit** (Abschnitt 3)
- [ ] Werbetext, Beschreibung, Schlüsselwörter, Support-URL, Copyright, Build auf der **Versionsseite** (Abschnitt 4)
- [ ] Mindestens 3 Screenshots (6.9") hochgeladen (Abschnitt 5)
- [ ] **App-Datenschutz** mit Werbedaten veröffentlicht (Abschnitt 6)
- [ ] DSA-Händlerstatus erklärt (Abschnitt 8)
- [ ] Review-Kontakt mit Telefonnummer und Hinweisen ausgefüllt (Abschnitt 9)
- [ ] Release-Art gewählt (empfohlen: manuell)
- [ ] Auf TestFlight einmal durchgespielt: Lernrunde, Sprachwechsel, Aussprache, Einstellungen, Dunkelmodus, Werbung, Kauf

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

Danach: Build in App Store Connect abwarten (Reiter **TestFlight** zeigt «Wird verarbeitet») → auf der Versionsseite bei **Build** auswählen → **Zur Prüfung hinzufügen** → **An App Review senden**. Die Prüfung dauert meist 24 bis 48 Stunden. Bei einer Ablehnung steht der Grund im **Resolution Center** (Seitenleiste der App-Seite); antworte dort direkt.

Werbung und Kauf brauchen einen neuen nativen Build, ein OTA-Update reicht nicht.
