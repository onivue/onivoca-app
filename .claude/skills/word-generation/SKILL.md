---
name: word-generation
description: Erzeugt und erweitert die Lern-Stammdaten (src/data/words/data.json) mit schwierigen englischen Wörtern und verwandten Wörtern nach dem WordEntry-Schema. Verwenden, wenn Vokabeln, Wörter, Karteikarten oder Beispielsätze für Onivoca generiert, ergänzt oder angereichert werden sollen.
---

# Lernwörter für Onivoca generieren

Du erweiterst `src/data/words/data.json`, die einzige Quelle der Lern-Stammdaten (wird beim Start in die SQLite-Datenbank geladen). Die Datei ist ein JSON-Array von Einträgen. Es sind Vokabeln für eine Lern-App (Deutschsprachige lernen Englisch). Ziel sind
schwierige englische Wörter (B2–C2) und Wörter, die mit ihnen zusammenhängen.

## Auftrag

Du bekommst entweder

- **A) Eine Wortliste** (Lemma, optional Wortart und deutsche Übersetzung): Erstelle dazu vollständige Einträge, oder
- **B) Ein Thema/Cluster** (z. B. "Gericht und Justiz"): Wähle 15–25 passende schwierige Wörter und erstelle Einträge.

Erzeuge in beiden Fällen zusätzlich verwandte Wörter (Synonyme, Gegenteile, Wortfamilie,
Verwechslungswörter) als eigene Einträge, sofern sie selbst schwierig genug sind.
Bestehende Einträge stehen in `src/data/words/data.json`; prüfe dort, ob ein Wort schon existiert. Ist es vorhanden und noch unvollständig (z. B. `source: "favorite"` ohne Beispiele), reichere den bestehenden Eintrag an (gleiche `id`, `source` bleibt `favorite`), statt ihn doppelt anzulegen. Verweise per `ref` auf bestehende IDs.

## Regeln

1. Eine Karte pro Lemma, Wortart und Bedeutung. Hat ein Wort mehrere wichtige Bedeutungen, mache mehrere Einträge (`-1`, `-2` oder sprechender Suffix, z. B. `embrace-verb-hug`, `embrace-verb-accept`).
2. Korrigiere Tippfehler der Eingabe und nutze die Grundform (Lemma). Entferne Satzfragmente, Duplikate und zu einfache Wörter (unter B2).
3. Genau 3 Beispielsätze:
   - 1: einfacher, klarer Kernsatz
   - 2: typische Verwendung (Collocation oder anderer Kontext)
   - 3: anspruchsvollerer oder abweichender Kontext (z. B. Passiv, formell, Gegensatz)

   Sätze sind natürlich, 6–16 Wörter, ohne Eigennamen. `hit` ist die exakte Wortform im Satz.
4. `de` ist kurz (1–3 Wörter, Hauptbedeutung); weitere Bedeutungen kommen in `deAlt`.
5. `definitionEn`: einfache englische Definition, höchstens 15 Wörter, ohne das Wort selbst.
6. `usage.collocations`: 2–5 echte Wortverbindungen. `usage.tip`: deutscher Hinweis (Register, typische Fehler, Konstruktion). Optional `usage.grammar` und `mnemonic` (deutsche Merkhilfe).
7. `relations`: 2–6 Einträge. `ref` nur setzen, wenn die ID in diesem Lauf oder im Bestand existiert. Typen: `synonym`, `antonym`, `confusable`, `family`, `collocate`, `related`. `confusable` immer mit kurzer deutscher Abgrenzung in `noteDe`.
8. `register`: `neutral`, `formal`, `informal`, `literary`, `archaic`, `slang` oder `vulgar`. Vulgäres nur auf ausdrückliche Anweisung.
9. `level`: `B2`, `C1` oder `C2`.
10. `topics`: mindestens eines aus `daily`, `emotion`, `law`, `society`, `body`, `nature`, `work`.
11. `clusters`: Lerngruppe(n) als Slug (z. B. `court-and-justice`). Neue Cluster-Slugs werden zusätzlich in `CLUSTER_LABELS` (`src/data/cards.ts`) mit deutschem Namen eingetragen.
12. `source` ist bei neuen Einträgen `"generated"`, bei angereicherten Favoriten bleibt es `"favorite"`.
13. Keine erfundenen Wörter oder Übersetzungen. Bei Unsicherheit den Eintrag weglassen und am Ende unter "Unsicher" auflisten.
14. IPA im amerikanischen Englisch, in Schrägstrichen.

## Ausgabeformat

Neue Einträge werden an das Array in `src/data/words/data.json` angehängt (bestehende Einträge nicht löschen oder umsortieren). Danach `SCHEMA_VERSION` in `src/db/database.ts` erhöhen, damit die Datenbank neu befüllt wird. Es gibt keine weiteren Dateien oder Imports.
IDs haben kein Präfix (`embrace-verb-hug`; bestehende Favoriten-IDs wie `embrace` bleiben unverändert).

```json
{
  "id": "embrace-verb-hug",
  "lemma": "embrace",
  "pos": "verb",
  "ipa": "/ɪmˈbreɪs/",
  "level": "C1",
  "register": "neutral",
  "de": "umarmen",
  "deAlt": ["in die Arme schließen"],
  "definitionEn": "to hold someone closely in your arms",
  "examples": [
    { "en": "She embraced her brother at the station.", "de": "Sie umarmte ihren Bruder am Bahnhof.", "hit": "embraced" },
    { "en": "He warmly embraced his old friend.", "de": "Er umarmte seinen alten Freund herzlich.", "hit": "embraced" },
    { "en": "They embraced each other before parting.", "de": "Sie umarmten sich vor dem Abschied.", "hit": "embraced" }
  ],
  "usage": {
    "collocations": ["embrace someone warmly", "embrace each other"],
    "grammar": "transitiv",
    "tip": "Für 'annehmen' im übertragenen Sinn gibt es einen eigenen Eintrag (embrace-verb-accept)."
  },
  "mnemonic": "em-BRACE: die Arme wie eine Klammer (brace) um jemanden legen.",
  "relations": [
    { "type": "synonym", "word": "hug", "noteDe": "umgangssprachlicher" },
    { "type": "family", "word": "embrace", "ref": "embrace-noun-hug" }
  ],
  "topics": ["emotion"],
  "clusters": ["body-and-gestures"],
  "source": "generated"
}
```

## Prüfliste vor der Abgabe

- Jede ID ist eindeutig, kleingeschrieben und mit Bindestrichen.
- Jeder Eintrag hat genau 3 Beispiele, und `hit` kommt im englischen Satz vor.
- Jede `ref` zeigt auf eine vorhandene ID.
- Das JSON ist syntaktisch gültig; `npm run validate:words` läuft ohne Fehler.

Am Ende der Antwort: Abschnitt "Unsicher" und Abschnitt "Gestrichen" (mit Grund) als Liste.
