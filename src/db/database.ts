import * as SQLite from "expo-sqlite";
import type { CardData, CategoryId } from "../data/cards";
import { SEED_CARDS } from "./favorites";

// Bei Änderungen an Schema oder Startdaten erhöhen: die Karten werden dann neu eingespielt.
// Der Lernstand liegt getrennt (AsyncStorage) und bleibt erhalten.
const SCHEMA_VERSION = 2;

type CardRow = {
  id: string;
  front: string;
  back: string;
  category: CategoryId;
  phonetic: string;
  note: string | null;
};
type ExampleRow = { card_id: string; en: string; de: string };

async function openDatabase() {
  const db = await SQLite.openDatabaseAsync("onivue.db");
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");

  if ((row?.user_version ?? 0) < SCHEMA_VERSION) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(`
        DROP TABLE IF EXISTS examples;
        DROP TABLE IF EXISTS cards;
        CREATE TABLE cards (
          id TEXT PRIMARY KEY NOT NULL,
          front_key TEXT NOT NULL UNIQUE,
          front TEXT NOT NULL,
          back TEXT NOT NULL,
          category TEXT NOT NULL,
          phonetic TEXT NOT NULL,
          note TEXT
        );
        CREATE TABLE examples (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          card_id TEXT NOT NULL REFERENCES cards(id),
          en TEXT NOT NULL,
          de TEXT NOT NULL,
          UNIQUE (card_id, en)
        );
      `);

      for (const card of SEED_CARDS) {
        await db.runAsync(
          "INSERT INTO cards (id, front_key, front, back, category, phonetic, note) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [card.id, normalize(card.front), card.front, card.back, card.category, card.phonetic, card.note ?? null],
        );
        for (const example of card.examples) {
          await db.runAsync("INSERT INTO examples (card_id, en, de) VALUES (?, ?, ?)", [
            card.id,
            example.en,
            example.de,
          ]);
        }
      }
    });
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  }

  return db;
}

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("en").replace(/[^\p{L}\p{N}]+/gu, "");
}

// Lädt alle Karten samt Beispielen aus der Datenbank.
export async function loadCards(): Promise<CardData[]> {
  const db = await openDatabase();
  const cards = await db.getAllAsync<CardRow>("SELECT * FROM cards ORDER BY rowid");
  const examples = await db.getAllAsync<ExampleRow>("SELECT card_id, en, de FROM examples ORDER BY id");

  return cards.map((card) => ({
    id: card.id,
    front: card.front,
    back: card.back,
    category: card.category,
    phonetic: card.phonetic,
    note: card.note ?? undefined,
    examples: examples.filter((e) => e.card_id === card.id).map(({ en, de }) => ({ en, de })),
  }));
}
