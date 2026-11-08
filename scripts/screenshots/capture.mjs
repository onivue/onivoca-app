#!/usr/bin/env node
// Nimmt die App im iOS-Simulator auf: Release-Build mit Screenshot-Modus, Lernstand und Einstellungen
// vorbelegt, saubere Statusleiste (9:41), jede Szene aus scenes.mjs in Dunkel und Hell.
//
//   npm run screenshots:capture                        alles (baut bei Bedarf)
//   npm run screenshots:capture -- --skip-build        vorhandenen Build aus .screenshots/build nutzen
//   npm run screenshots:capture -- --modes dark --scenes learn-front,words
//   npm run screenshots:capture -- --device "iPhone 17 Pro Max"
//
// Ergebnis: .screenshots/raw/<modus>/<nr>-<szene>.png. Danach: npm run screenshots:compose
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MODES, SCENES } from "./scenes.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const WORK = join(ROOT, ".screenshots");
const BUILD = join(WORK, "build");
const APP_PATH = join(BUILD, "Build/Products/Release-iphonesimulator/onivoca.app");
const BUNDLE_ID = "ch.onivoca.app";
const DEFAULT_DEVICES = ["iPhone 18 Pro Max", "iPhone 17 Pro Max"]; // 6,9 Zoll: 1320 × 2868

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const sleep = (seconds) => new Promise((done) => setTimeout(done, seconds * 1000));
const simctl = (...a) => execFileSync("xcrun", ["simctl", ...a], { encoding: "utf8" });
const log = (message) => console.log(`\x1b[36m▸\x1b[0m ${message}`);

// ---------- Gerät ----------
function findDevice() {
  const wanted = option("device") ? [option("device")] : DEFAULT_DEVICES;
  const { devices } = JSON.parse(simctl("list", "devices", "available", "-j"));
  for (const name of wanted) {
    // neueste Runtime zuerst
    const runtimes = Object.keys(devices).sort().reverse();
    for (const runtime of runtimes) {
      const device = devices[runtime].find((d) => d.name === name);
      if (device) return device;
    }
  }
  throw new Error(`Kein Simulator gefunden (${wanted.join(", ")}). Mit --device "<Name>" wählen, siehe: xcrun simctl list devices`);
}

// ---------- Build ----------
function build(udid) {
  log("Baue Release-Build mit Screenshot-Modus (das dauert beim ersten Mal einige Minuten) …");
  mkdirSync(WORK, { recursive: true });
  const logFile = join(WORK, "build.log");
  const result = spawnSync(
    "xcodebuild",
    [
      "-workspace", join(ROOT, "ios/onivoca.xcworkspace"),
      "-scheme", "onivoca",
      "-configuration", "Release",
      "-sdk", "iphonesimulator",
      "-destination", `id=${udid}`,
      "-derivedDataPath", BUILD,
      "ONLY_ACTIVE_ARCH=YES",
      "CODE_SIGNING_ALLOWED=NO",
      "build",
    ],
    { cwd: ROOT, env: { ...process.env, EXPO_PUBLIC_SCREENSHOT_MODE: "1", NODE_ENV: "production" }, encoding: "utf8", maxBuffer: 1 << 30 },
  );
  writeFileSync(logFile, `${result.stdout}\n${result.stderr}`);
  if (result.status !== 0) {
    console.error(result.stdout.split("\n").slice(-40).join("\n"));
    throw new Error(`Build fehlgeschlagen, Log: ${logFile}`);
  }
}

// ---------- Vorbelegter Zustand (AsyncStorage) ----------
// Realistischer Lernstand: ein Teil gelernt, ein Teil am Lernen, der Rest neu (deterministisch).
function hash(text) {
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 100;
}

function seedProgress() {
  const cards = [
    ...JSON.parse(readFileSync(join(ROOT, "src/data/words/data.json"), "utf8")),
    ...JSON.parse(readFileSync(join(ROOT, "src/data/words/es.json"), "utf8")),
  ];
  const progress = {};
  for (const { id } of cards) {
    const roll = hash(id);
    if (roll < 30) {
      progress[id] = { score: 4, again: 1, good: 2, easy: 2, dueRound: 20, history: ["easy", "good", "easy", "good", "again"] };
    } else if (roll < 55) {
      const score = 1 + (roll % 3);
      progress[id] = { score, again: 1, good: score, easy: 0, dueRound: 12, history: ["good", "again"] };
    }
  }
  return progress;
}

function storageDir(udid) {
  const data = simctl("get_app_container", udid, BUNDLE_ID, "data").trim();
  return join(data, "Library/Application Support", BUNDLE_ID, "RCTAsyncLocalStorage_V1");
}

function writeStorage(udid, nav, overrides = {}) {
  const dir = storageDir(udid);
  mkdirSync(dir, { recursive: true });
  for (const file of readdirSync(dir)) rmSync(join(dir, file), { recursive: true, force: true });
  const manifest = {
    "onboarding-done-v1": "1",
    "learn-language-v1": "en",
    "learn-deck-v1": "words",
    "progress-v2": JSON.stringify(seedProgress()),
    "study-settings-v1": JSON.stringify({
      round: 12,
      sessionSize: 10,
      delays: { again: 1, good: 3 },
      mix: { mode: "preset", preset: "balanced", weights: { A1: 3, A2: 3, B1: 3, B2: 3, C1: 3, C2: 3 } },
    }),
    "screenshot-nav": JSON.stringify(nav),
    ...overrides,
  };
  writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest));
}

// ---------- Aufnahme ----------
const stop = (udid) => {
  try {
    execFileSync("xcrun", ["simctl", "terminate", udid, BUNDLE_ID], { stdio: "ignore" });
  } catch {} // läuft nicht
};

async function main() {
  const device = findDevice();
  const udid = device.udid;
  log(`Simulator: ${device.name} (${udid})`);

  if (!flag("skip-build") || !existsSync(APP_PATH)) build(udid);

  const modes = option("modes")?.split(",") ?? MODES;
  const only = option("scenes")?.split(",");
  const scenes = SCENES.filter((s) => !only || only.includes(s.id));

  // Neustart räumt Systemdialoge weg, die von früheren Läufen hängen geblieben sein könnten.
  for (const step of ["shutdown", "boot"]) {
    try {
      execFileSync("xcrun", ["simctl", step, udid], { stdio: "ignore" });
    } catch {} // schon aus bzw. schon an
  }
  simctl("bootstatus", udid, "-b");
  simctl(
    "status_bar", udid, "override",
    "--time", "9:41", "--batteryState", "charged", "--batteryLevel", "100",
    "--cellularMode", "active", "--cellularBars", "4", "--wifiBars", "3", "--operatorName", "",
  );

  log("Installiere App");
  stop(udid);
  simctl("install", udid, APP_PATH);
  // Erster Start legt Datenbank und Speicherordner an.
  simctl("launch", udid, BUNDLE_ID);
  await sleep(10);
  stop(udid);

  for (const mode of modes) {
    log(`Modus: ${mode}`);
    simctl("ui", udid, "appearance", mode);
    const out = join(WORK, "raw", mode);
    rmSync(out, { recursive: true, force: true });
    mkdirSync(out, { recursive: true });

    for (const [index, scene] of scenes.entries()) {
      stop(udid);
      await sleep(0.5);
      writeStorage(udid, scene.pre ? [scene.pre, scene.path] : [scene.path], scene.storage);
      simctl("launch", udid, BUNDLE_ID);
      await sleep(scene.pre ? 8 : 5.5);
      const file = join(out, `${String(index + 1).padStart(2, "0")}-${scene.id}.png`);
      simctl("io", udid, "screenshot", "--type=png", file);
      log(`  ${mode}/${scene.id}`);
    }
  }

  stop(udid);
  simctl("status_bar", udid, "clear");
  log(`Fertig: ${join(WORK, "raw")}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
