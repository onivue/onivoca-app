# onivoca

Englisch-Lernapp (Fokus iOS) mit Karteikarten. Gebaut mit Expo, Expo Router, TypeScript und Lucide-Icons.

- KI-generierte vorinstallierte Lernkarten mit deutschen Kurzglossen; Beispiele werden lokal aus einer Vorlage erzeugt
- Karte antippen: umdrehen. Lautsprecher-Symbol: Aussprache anhören
- Entspanntes Lernen ohne Termine: Punkte pro Karte, Übersicht "gelernt / offen", Lernstand wird auf dem Gerät gespeichert
- Detailseite pro Wort mit Verlauf (wie oft vorgekommen, Nochmal / Gut / Einfach)
- Native Tab-Leiste (Liquid Glass ab iOS 26), Schrift Space Grotesk (SIL OFL 1.1; Lizenz in der App unter «Drittanbieter-Lizenzen»), flache Pastellfarben

## Starten

```bash
npm install
npm start        # QR-Code mit der Expo-Go-App (iPhone) scannen
npm run ios      # oder direkt im iOS-Simulator (Xcode nötig)
```

## iOS-Release mit EAS

Die folgenden Befehle im Projektstamm ausführen. Voraussetzung sind ein Expo-Konto und ein Apple-Developer-Konto. Beim ersten Lauf fragt EAS interaktiv nach den nötigen iOS-Signatur- und App-Store-Connect-Zugangsdaten.

1. Einmalig bei Expo anmelden (falls noch nicht angemeldet):

  ```bash
  npx eas-cli@latest login
  ```

2. iOS-Produktionsbuild erstellen und warten, bis EAS den Build abgeschlossen hat:

  ```bash
  npx eas-cli@latest build --platform ios --profile production
  ```

3. Den neuesten iOS-Build zu App Store Connect hochladen:

  ```bash
  npx eas-cli@latest submit --platform ios --profile production --latest
  ```

Anschliessend erscheint der Build nach der Verarbeitung in TestFlight. Für die Veröffentlichung im App Store muss er danach in App Store Connect geprüft und zur App Review eingereicht werden. `eas.json` verwendet die Versionsverwaltung von EAS mit automatischem Hochzählen der iOS-Buildnummer; die sichtbare App-Version (`expo.version` in `app.json`) bei einem neuen Store-Release weiterhin selbst aktualisieren.

## Struktur

```
src/
  app/                 Seiten. Jede Datei = eine Route (Expo Router)
    _layout.tsx        Wurzel: Schrift + Lernstand laden, Stack-Navigation
    word/[id].tsx      Detailseite eines Worts (dynamische Route)
    (tabs)/
      _layout.tsx      Native Tab-Leiste
      index.tsx        Tab "Lernen": Lernrunde mit Karteikarten
      words.tsx        Tab "Wörter": Liste aller Karten
      stats.tsx        Tab "Fortschritt": Statistik, Zurücksetzen
  components/
    Flashcard.tsx      Karte mit Flip- und Einflug-Animation
    RatingButtons.tsx  Nochmal / Gut / Einfach
    PressableScale.tsx Button mit Feder-Animation
    ProgressBar.tsx    Animierter Balken
    Screen.tsx         Seitenrahmen mit Titel
    Text.tsx           Text-Wrapper mit passendem Space-Grotesk-Schnitt
    StatusPill.tsx     Etikett Neu / Am Lernen / Gelernt
  data/cards.ts        Typen und Kategorien der Karten
  db/database.ts       SQLite: Tabellen anlegen, Karten laden
  db/favorites.ts      Importierte, normalisierte und deduplizierte Favoriten
  state/cards.tsx      Karten aus der Datenbank für alle Seiten (useCards)
  lib/srs.ts           Lernlogik (reine Funktionen)
  lib/speak.ts         Text-to-Speech
  state/progress.tsx   Lernstand (Context + AsyncStorage)
  theme/colors.ts      Farben
  theme/ratings.ts     Label, Farbe und Icon der drei Bewertungen
```

## Wie funktioniert das Lernen?

Keine Fristen, keine Tage: Man lernt in Runden, wann und wie lange man will.
Jede Karte sammelt Punkte (0 bis 4):

- **Nochmal**: 2 Punkte weniger, die Karte kommt in derselben Runde wieder
- **Gut**: 1 Punkt mehr
- **Einfach**: 2 Punkte mehr

Ab 4 Punkten gilt eine Karte als **gelernt**. Eine Runde hat bis zu 10 Karten: erst ein paar, die noch wackeln, dann neue. Sind alle gelernt, gibt es eine Auffrischung mit zufälligen Karten. Alles steht in `src/lib/srs.ts`.

Die Startkarten werden beim ersten Start aus `src/db/favorites.ts` in SQLite importiert. Bei Änderungen an den Startdaten `SCHEMA_VERSION` in `src/db/database.ts` erhöhen; die Seed-Karten werden dann neu eingespielt, der Lernstand bleibt erhalten.

## Wichtige Konzepte

- **Routing:** Der Dateiname bestimmt die Route. Ordner in Klammern wie `(tabs)` gruppieren nur, `[id]` ist ein Platzhalter.
- **State:** `useState` für lokale Werte, `useProgress()` für den gemeinsamen Lernstand.
- **Animationen:** React Native `Animated` (Flip, Einflug, Federn, Balken).
- **Icons:** `<Volume2 size={24} color="#000" />` aus `lucide-react-native`. Die Tab-Leiste nutzt SF Symbols.
- **Aussprache:** `expo-speech`, auch bei aktivem Stumm-Schalter hörbar (`expo-audio`).

## Nützliche Befehle

```bash
npx expo install <paket>   # Pakete in zur Expo-Version passender Version installieren
npx tsc --noEmit           # TypeScript prüfen
```

## Datenschutzerklärung veröffentlichen

Der GitHub-Actions-Workflow veröffentlicht `docs/privacy.html` auf GitHub Pages. Vor dem ersten Deployment muss GitHub Pages unter **Settings > Pages** für das Repository aktiviert und **GitHub Actions** als Build- und Deploymentquelle ausgewählt werden. Danach benötigt der Workflow kein zusätzliches Token-Secret.
