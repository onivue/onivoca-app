import * as SQLite from "expo-sqlite";
import type { Lang, Level, Pos, Register, RelationType, TopicId, WordEntry } from "../data/cards";
import data from "../data/words/data.json";
import dataEs from "../data/words/es.json";
import sentencesEs from "../data/words/es-sentences.json";

// Stammdaten: data.json ist die einzige Quelle für die Datenbank.
const SEED_WORDS = [...(data as WordEntry[]), ...(dataEs as WordEntry[])];

// Satzkarten aus dem Anki-Deck: kompakt als [Satz, Übersetzung, Fokuswort?] gespeichert.
const SEED_SENTENCES: WordEntry[] = (sentencesEs as string[][]).map(([text, de, focus], index) => ({
  id: `es-satz-${String(index + 1).padStart(4, "0")}`,
  lang: "es",
  lemma: text,
  pos: "sentence",
  de,
  focus: focus || undefined,
  examples: [],
  relations: [],
  topics: [],
  clusters: [],
  source: "generated",
}));

// Bei Änderungen an Schema oder Startdaten erhöhen: die Karten werden dann neu eingespielt.
// Der Lernstand liegt getrennt (AsyncStorage) und bleibt erhalten.
// Zusätzlich fließt die Anzahl der Karten ein, damit neue Wörter auch ohne Hochzählen eingespielt werden.
const SCHEMA_REVISION = 8;
const SCHEMA_VERSION = SCHEMA_REVISION * 100000 + (SEED_WORDS.length + SEED_SENTENCES.length);

type CardRow = {
  id: string;
  lemma: string;
  pos: Pos | null;
  ipa: string | null;
  level: Level | null;
  lang: Lang | null;
  focus: string | null;
  register: Register | null;
  de: string;
  de_alt: string | null;
  definition_en: string | null;
  collocations: string | null;
  grammar: string | null;
  tip: string | null;
  mnemonic: string | null;
  source: WordEntry["source"];
};
type ExampleRow = { card_id: string; en: string; de: string; hit: string | null };
type RelationRow = { card_id: string; type: RelationType; word: string; ref_id: string | null; note_de: string | null };
type TopicRow = { card_id: string; topic: TopicId };
type ClusterRow = { card_id: string; cluster: string };

async function openDatabase() {
  const db = await SQLite.openDatabaseAsync("onivue.db");
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");

  if ((row?.user_version ?? 0) !== SCHEMA_VERSION) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(`
        DROP TABLE IF EXISTS card_clusters;
        DROP TABLE IF EXISTS card_topics;
        DROP TABLE IF EXISTS relations;
        DROP TABLE IF EXISTS examples;
        DROP TABLE IF EXISTS cards;
        CREATE TABLE cards (
          id TEXT PRIMARY KEY NOT NULL,
          lemma_key TEXT NOT NULL,
          lemma TEXT NOT NULL,
          pos TEXT,
          ipa TEXT,
          level TEXT,
          lang TEXT NOT NULL DEFAULT 'en',
          focus TEXT,
          register TEXT,
          de TEXT NOT NULL,
          de_alt TEXT,
          definition_en TEXT,
          collocations TEXT,
          grammar TEXT,
          tip TEXT,
          mnemonic TEXT,
          source TEXT NOT NULL
        );
        CREATE TABLE examples (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          card_id TEXT NOT NULL REFERENCES cards(id),
          position INTEGER NOT NULL,
          en TEXT NOT NULL,
          de TEXT NOT NULL,
          hit TEXT
        );
        CREATE TABLE relations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          card_id TEXT NOT NULL REFERENCES cards(id),
          type TEXT NOT NULL,
          word TEXT NOT NULL,
          ref_id TEXT,
          note_de TEXT
        );
        CREATE TABLE card_topics (card_id TEXT NOT NULL REFERENCES cards(id), topic TEXT NOT NULL);
        CREATE TABLE card_clusters (card_id TEXT NOT NULL REFERENCES cards(id), cluster TEXT NOT NULL);
      `);

      for (const card of SEED_WORDS) {
        await db.runAsync(
          `INSERT INTO cards (id, lemma_key, lemma, pos, ipa, level, lang, register, de, de_alt, definition_en,
             collocations, grammar, tip, mnemonic, source)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            card.id,
            normalize(card.lemma),
            card.lemma,
            card.pos ?? null,
            card.ipa ?? null,
            card.level ?? null,
            card.lang ?? "en",
            card.register ?? null,
            card.de,
            card.deAlt?.length ? JSON.stringify(card.deAlt) : null,
            card.definitionEn ?? null,
            card.usage?.collocations?.length ? JSON.stringify(card.usage.collocations) : null,
            card.usage?.grammar ?? null,
            card.usage?.tip ?? null,
            card.mnemonic ?? null,
            card.source,
          ],
        );
        for (const [index, example] of card.examples.entries()) {
          await db.runAsync("INSERT INTO examples (card_id, position, en, de, hit) VALUES (?, ?, ?, ?, ?)", [
            card.id,
            index + 1,
            example.en,
            example.de,
            example.hit ?? null,
          ]);
        }
        for (const rel of card.relations) {
          await db.runAsync("INSERT INTO relations (card_id, type, word, ref_id, note_de) VALUES (?, ?, ?, ?, ?)", [
            card.id,
            rel.type,
            rel.word,
            rel.ref ?? null,
            rel.noteDe ?? null,
          ]);
        }
        for (const topic of card.topics) {
          await db.runAsync("INSERT INTO card_topics (card_id, topic) VALUES (?, ?)", [card.id, topic]);
        }
        for (const cluster of card.clusters) {
          await db.runAsync("INSERT INTO card_clusters (card_id, cluster) VALUES (?, ?)", [card.id, cluster]);
        }
      }

      // Satzkarten haben nur Grunddaten und werden in Blöcken eingefügt (schneller beim ersten Start).
      const CHUNK = 100;
      for (let i = 0; i < SEED_SENTENCES.length; i += CHUNK) {
        const chunk = SEED_SENTENCES.slice(i, i + CHUNK);
        await db.runAsync(
          `INSERT INTO cards (id, lemma_key, lemma, pos, lang, focus, de, source) VALUES ${chunk
            .map(() => "(?, ?, ?, ?, ?, ?, ?, ?)")
            .join(", ")}`,
          chunk.flatMap((c) => [c.id, normalize(c.lemma), c.lemma, "sentence", "es", c.focus ?? null, c.de, "generated"]),
        );
      }
    });
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  }

  return db;
}

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

function groupBy<T extends { card_id: string }>(rows: T[]) {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const list = map.get(row.card_id);
    if (list) list.push(row);
    else map.set(row.card_id, [row]);
  }
  return map;
}

// Lädt alle Karten samt Beispielen, Wortnetz, Themen und Clustern aus der Datenbank.
export async function loadCards(): Promise<WordEntry[]> {
  const db = await openDatabase();
  const cards = await db.getAllAsync<CardRow>("SELECT * FROM cards ORDER BY rowid");
  const examples = groupBy(await db.getAllAsync<ExampleRow>("SELECT * FROM examples ORDER BY position"));
  const relations = groupBy(await db.getAllAsync<RelationRow>("SELECT * FROM relations ORDER BY id"));
  const topics = groupBy(await db.getAllAsync<TopicRow>("SELECT * FROM card_topics"));
  const clusters = groupBy(await db.getAllAsync<ClusterRow>("SELECT * FROM card_clusters"));

  return cards.map((card) => {
    const collocations: string[] | undefined = card.collocations ? JSON.parse(card.collocations) : undefined;
    const hasUsage = collocations || card.grammar || card.tip;
    return {
      id: card.id,
      lemma: card.lemma,
      pos: card.pos ?? undefined,
      ipa: card.ipa ?? undefined,
      level: card.level ?? undefined,
      lang: card.lang ?? "en",
      focus: card.focus ?? undefined,
      register: card.register ?? undefined,
      de: card.de,
      deAlt: card.de_alt ? JSON.parse(card.de_alt) : undefined,
      definitionEn: card.definition_en ?? undefined,
      examples: (examples.get(card.id) ?? []).map((e) => ({ en: e.en, de: e.de, hit: e.hit ?? undefined })),
      usage: hasUsage
        ? { collocations, grammar: card.grammar ?? undefined, tip: card.tip ?? undefined }
        : undefined,
      mnemonic: card.mnemonic ?? undefined,
      relations: (relations.get(card.id) ?? []).map((r) => ({
        type: r.type,
        word: r.word,
        ref: r.ref_id ?? undefined,
        noteDe: r.note_de ?? undefined,
      })),
      topics: (topics.get(card.id) ?? []).map((t) => t.topic),
      clusters: (clusters.get(card.id) ?? []).map((c) => c.cluster),
      source: card.source,
    };
  });
}
