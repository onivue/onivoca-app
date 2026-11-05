// Prüft src/data/words/data.json (Englisch) und es.json (Spanisch). Aufruf: npm run validate:words
import { readFileSync } from "node:fs";

const FILES = ["src/data/words/data.json", "src/data/words/es.json"];
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REGISTERS = ["neutral", "formal", "informal", "literary", "archaic", "slang", "vulgar"];
const POS = ["noun", "verb", "adj", "adv", "phrasal-verb", "idiom", "phrase", "sentence"];
const RELATIONS = ["synonym", "antonym", "confusable", "family", "collocate", "related"];
const TOPICS = ["daily", "emotion", "law", "society", "body", "nature", "work"];

const SENTENCES_FILE = "src/data/words/es-sentences.json";

const errors = [];
const entries = [];
for (const FILE of FILES) {
  let data;
  try {
    data = JSON.parse(readFileSync(FILE, "utf8"));
  } catch (e) {
    console.error(`${FILE}: ungültiges JSON (${e.message})`);
    process.exit(1);
  }
  if (!Array.isArray(data)) {
    console.error(`${FILE}: Array erwartet`);
    process.exit(1);
  }
  for (const entry of data) entries.push({ file: FILE.split("/").pop(), entry });
}

const ids = new Set();
for (const { entry } of entries) {
  if (ids.has(entry.id)) errors.push(`${entry.id}: ID doppelt`);
  ids.add(entry.id);
}

const isStr = (v) => typeof v === "string" && v.trim().length > 0;
for (const { file, entry: e } of entries) {
  const at = `${file}:${e.id}`;
  const fail = (msg) => errors.push(`${at}: ${msg}`);
  if (!isStr(e.id) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) fail("ID muss kleingeschrieben mit Bindestrichen sein");
  const isEs = file === "es.json";
  if (isEs !== e.id.startsWith("es-")) fail("spanische IDs beginnen mit es-, englische nicht");
  if ((e.lang ?? "en") !== (isEs ? "es" : "en")) fail("lang passt nicht zur Datei");
  if (!isStr(e.lemma)) fail("lemma fehlt");
  if (!isStr(e.de)) fail("de fehlt");
  if (e.pos !== undefined && !POS.includes(e.pos)) fail(`pos ungültig: ${e.pos}`);
  if (e.level !== undefined && !LEVELS.includes(e.level)) fail(`level ungültig: ${e.level}`);
  if (e.register !== undefined && !REGISTERS.includes(e.register)) fail(`register ungültig: ${e.register}`);
  if (!Array.isArray(e.topics) || e.topics.length === 0 || e.topics.some((t) => !TOPICS.includes(t))) fail("topics ungültig");
  if (!Array.isArray(e.clusters)) fail("clusters fehlt");
  if (!["favorite", "generated"].includes(e.source)) fail("source ungültig");

  if (!Array.isArray(e.examples) || e.examples.length > 3) fail("examples: höchstens 3");
  for (const ex of e.examples ?? []) {
    if (!isStr(ex.en) || !isStr(ex.de)) fail("Beispiel braucht en und de");
    if (ex.hit && !ex.en.toLowerCase().includes(ex.hit.toLowerCase())) fail(`hit "${ex.hit}" nicht im Satz`);
  }

  for (const r of e.relations ?? []) {
    if (!RELATIONS.includes(r.type)) fail(`Relation-Typ ungültig: ${r.type}`);
    if (!isStr(r.word)) fail("Relation ohne word");
    if (r.ref && !ids.has(r.ref)) fail(`ref ${r.ref} existiert nicht`);
    if (r.type === "confusable" && !isStr(r.noteDe)) fail("confusable braucht noteDe");
  }

  // Alle Einträge müssen vollständig sein.
  {
    if (e.examples?.length !== 3) fail("genau 3 Beispiele nötig");
    for (const field of ["pos", "ipa", "level", "register", "definitionEn"]) if (!e[field]) fail(`${field} fehlt`);
    if (!e.usage?.collocations?.length) fail("usage.collocations fehlt");
    if (!isStr(e.usage?.tip)) fail("usage.tip fehlt");
    if (!(e.relations?.length >= 2)) fail("mindestens 2 relations");
  }
}

// Satzkarten (Anki): Array aus [Satz, Übersetzung, Fokuswort?]
try {
  const sentences = JSON.parse(readFileSync(SENTENCES_FILE, "utf8"));
  if (!Array.isArray(sentences)) errors.push(`${SENTENCES_FILE}: Array erwartet`);
  else
    sentences.forEach((row, i) => {
      const ok = Array.isArray(row) && row.length >= 2 && row.length <= 3 && row.every((v) => typeof v === "string");
      if (!ok || !isStr(row[0]) || !isStr(row[1])) errors.push(`${SENTENCES_FILE}[${i}]: [Satz, Übersetzung, Fokuswort?] erwartet`);
      else if (row[2] && !row[0].toLowerCase().includes(row[2].toLowerCase())) errors.push(`${SENTENCES_FILE}[${i}]: Fokuswort nicht im Satz`);
    });
  console.log(`Satzkarten: ${Array.isArray(sentences) ? sentences.length : 0}`);
} catch (e) {
  errors.push(`${SENTENCES_FILE}: ungültiges JSON (${e.message})`);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK: ${entries.length} Einträge`);
