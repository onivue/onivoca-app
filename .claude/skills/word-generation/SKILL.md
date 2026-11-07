---
name: word-generation
description: Erzeugt und erweitert die Lern-Stammdaten (src/data/words/data.json für Englisch, src/data/words/es.json für Spanisch) mit Wörtern und verwandten Wörtern nach dem WordEntry-Schema. Verwenden, wenn Vokabeln, Wörter, Karteikarten oder Beispielsätze für Onivoca (Englisch oder Spanisch) generiert, ergänzt oder angereichert werden sollen.
---

# Lernwörter für Onivoca generieren

Du erweiterst die Lern-Stammdaten (werden beim Start in die SQLite-Datenbank geladen). Es sind Vokabeln für eine Lern-App; Deutschsprachige lernen **Englisch** oder **Spanisch**. Jede Sprache hat eine eigene Datei, jeweils ein JSON-Array von Einträgen:

| Sprache | Datei | Zielgruppe der Wörter | ID-Präfix |
| --- | --- | --- | --- |
| Englisch (`en`) | `src/data/words/data.json` | A2–C2, Schwerpunkt B2–C2 | keins |
| Spanisch (`es`) | `src/data/words/es.json` | häufige Wörter, A1–B1 (bei Bedarf bis C2) | `es-` |

Zusätzlich gibt es `src/data/words/es-sentences.json`: Satzkarten aus dem Anki-Deck als Array von `[spanischer Satz, deutsche Übersetzung, Fokuswort?]`. Diese Datei wird nicht vom Skill erzeugt; sie braucht keine weiteren Felder und wird von `npm run validate:words` mitgeprüft.

Frage nicht nach, wenn die Sprache aus dem Auftrag klar ist; sonst: Englisch.

## Auftrag

Du bekommst entweder

- **A) Eine Wortliste** (Lemma, optional Wortart und deutsche Übersetzung): Erstelle dazu vollständige Einträge, oder
- **B) Ein Thema/Cluster** (z. B. "Gericht und Justiz"): Wähle 15–25 passende Wörter und erstelle Einträge, oder
- **C) Ein Anki-Deck / eine Frequenzliste** (z. B. `.apkg`): Wandle sie mit einem Skript in ein JSON um (Felder wie Wort, Beispielsatz, Übersetzung), wähle daraus die inhaltlich relevanten Wörter nach Häufigkeit und ergänze die fehlenden Felder selbst. Den Beispielsatz des Decks darfst du als Beispiel 1 übernehmen (Wortform in `hit`), wenn er zur gewählten Bedeutung passt.

Erzeuge zusätzlich verwandte Wörter (Synonyme, Gegenteile, Wortfamilie, Verwechslungswörter) als eigene Einträge, sofern sie selbst für die Zielgruppe relevant sind.
Bestehende Einträge stehen in der Datei der Sprache; prüfe dort, ob ein Wort schon existiert. Ist es vorhanden und noch unvollständig (z. B. `source: "favorite"` ohne Beispiele), reichere den bestehenden Eintrag an (gleiche `id`, `source` bleibt `favorite`), statt ihn doppelt anzulegen. Verweise per `ref` auf bestehende IDs (derselben Sprache).

## Regeln (für beide Sprachen)

1. Eine Karte pro Lemma, Wortart und Bedeutung. Hat ein Wort mehrere wichtige Bedeutungen, mache mehrere Einträge (`-1`, `-2` oder sprechender Suffix, z. B. `embrace-verb-hug`, `embrace-verb-accept`).
2. Korrigiere Tippfehler der Eingabe und nutze die Grundform (Lemma). Entferne Satzfragmente, Duplikate, Eigennamen und Funktionswörter (Artikel, Präpositionen, Pronomen), außerdem Wörter, die für die Zielstufe zu einfach sind (Englisch: unter A2; A2–B1 nur, wenn ausdrücklich einfachere Wörter gewünscht sind).
3. Genau 3 Beispielsätze:
   - 1: einfacher, klarer Kernsatz
   - 2: typische Verwendung (Collocation oder anderer Kontext)
   - 3: anspruchsvollerer oder abweichender Kontext (z. B. Passiv, formell, Gegensatz)

   Sätze sind natürlich, 6–16 Wörter (Spanisch Stufe A1: ab 4 Wörter), ohne Eigennamen. `hit` ist die exakte Wortform im Satz.
   Die Felder heißen aus historischen Gründen `en` (Satz in der Zielsprache) und `de` (deutsche Übersetzung).
4. `de` ist kurz (1–3 Wörter, Hauptbedeutung); weitere Bedeutungen kommen in `deAlt`.
5. `definitionEn`: einfache Definition **in der Zielsprache** (Englisch bzw. Spanisch), höchstens 15 Wörter, ohne das Wort selbst.
6. `usage.collocations`: 2–5 echte Wortverbindungen in der Zielsprache. `usage.tip`: deutscher Hinweis (Register, typische Fehler, Konstruktion). Optional `usage.grammar` und `mnemonic` (deutsche Merkhilfe).
7. `relations`: 2–6 Einträge. `ref` nur setzen, wenn die ID in diesem Lauf oder im Bestand existiert. Typen: `synonym`, `antonym`, `confusable`, `family`, `collocate`, `related`. `confusable` immer mit kurzer deutscher Abgrenzung in `noteDe`.
8. `register`: `neutral`, `formal`, `informal`, `literary`, `archaic`, `slang` oder `vulgar`. Vulgäres nur auf ausdrückliche Anweisung.
9. `level`: `A1`, `A2`, `B1`, `B2`, `C1` oder `C2`.
10. `topics`: mindestens eines aus `daily`, `emotion`, `law`, `society`, `body`, `nature`, `work`.
11. `clusters`: Lerngruppe(n) als Slug (z. B. `court-and-justice`). Neue Cluster-Slugs werden zusätzlich in `CLUSTER_LABELS` (`src/data/cards.ts`) mit deutschem Namen eingetragen.
12. `source` ist bei neuen Einträgen `"generated"`, bei angereicherten Favoriten bleibt es `"favorite"`.
13. Keine erfundenen Wörter oder Übersetzungen. Bei Unsicherheit den Eintrag weglassen und am Ende unter "Unsicher" auflisten.
14. `lang` ist `"en"` oder `"es"` (bei Englisch darf es fehlen, bei Spanisch ist es Pflicht).

## Sprachspezifisch

### Englisch
- Schwierige Wörter (B2–C2) und Wörter, die mit ihnen zusammenhängen; auf Wunsch auch einfachere (A2–B1), damit der Schwierigkeits-Mix in der App alle Stufen bedienen kann.
- IPA im amerikanischen Englisch, in Schrägstrichen.

### Spanisch
- Häufige, nützliche Wörter (A1–B1) und deren Wortfamilie; Funktionswörter und Eigennamen weglassen.
- IDs: Präfix `es-`, ohne Akzente und ohne ñ (`enseñar` → `es-ensenar-verb`, `mañana` → `es-manana-noun`; nur a–z, 0–9, Bindestrich). Das Lemma behält Akzente und ñ.
- Lemma ist bei Verben der Infinitiv, bei Nomen die Singularform, bei Adjektiven die maskuline Singularform.
- IPA im europäischen Spanisch (Betonung per `ˈ`), in Schrägstrichen.
- `usage.grammar` enthält bei Nomen **immer das Genus mit Artikel** (`Nomen, maskulin (el problema)`), bei Verben Konjugationsbesonderheiten (Stammwechsel, unregelmäßige Formen, Pretérito).
- Verwechslungspaare, die Deutschsprachige oft falsch nutzen (`ser`/`estar`, `saber`/`conocer`, `por`/`para`), als `confusable` mit `noteDe` anlegen.
- Beispielsätze natürlich und alltagsnah; die deutsche Übersetzung ist idiomatisch, nicht wörtlich.

## Ausgabeformat

Neue Einträge werden an das Array der jeweiligen Datei angehängt (bestehende Einträge nicht löschen oder umsortieren). Danach `SCHEMA_VERSION` in `src/db/database.ts` erhöhen, damit die Datenbank neu befüllt wird. Es gibt keine weiteren Dateien oder Imports. Der Lernstand liegt getrennt und bleibt erhalten; Englisch und Spanisch haben wegen des ID-Präfixes getrennte Lernstände.
IDs sind kleingeschrieben mit Bindestrichen (`embrace-verb-hug`; spanisch `es-tiempo-noun`). Bestehende Favoriten-IDs wie `embrace` bleiben unverändert.

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

Spanisches Beispiel (Auszug): `"id": "es-tiempo-noun"`, `"lang": "es"`, `"lemma": "tiempo"`, `"ipa": "/ˈtjem.po/"`, `"level": "A1"`, `"de": "Zeit"`, `"deAlt": ["Wetter"]`, `"definitionEn": "lo que miden los relojes: horas, días y años"`, `"usage": { "grammar": "Nomen, maskulin (el tiempo)", ... }`.

## Prüfliste vor der Abgabe

- Jede ID ist eindeutig, kleingeschrieben und mit Bindestrichen; spanische IDs beginnen mit `es-` und stehen in `es.json`, englische nicht.
- Jeder Eintrag hat genau 3 Beispiele, und `hit` kommt im Satz der Zielsprache vor.
- Jede `ref` zeigt auf eine vorhandene ID.
- Jeder neue Cluster-Slug steht in `CLUSTER_LABELS`.
- Das JSON ist syntaktisch gültig; `npm run validate:words` läuft ohne Fehler (prüft beide Dateien), außerdem `npx tsc --noEmit`.

Am Ende der Antwort: Abschnitt "Unsicher" und Abschnitt "Gestrichen" (mit Grund) als Liste.
