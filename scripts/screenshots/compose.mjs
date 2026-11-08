#!/usr/bin/env node
// Setzt aus den Rohaufnahmen (.screenshots/raw) die fertigen App-Store-Bilder zusammen:
// Überschrift in Space Grotesk (wie in der App), Gerät mit Rahmen, Hintergrund in den Farben der App.
//
//   npm run screenshots:compose                 alle Modi
//   npm run screenshots:compose -- --modes dark
//
// Ergebnis (App Store Connect nimmt pro Grössen-Slot nur genau diese Masse an):
//   store-screenshots/6.9/<modus>/<nr>-<szene>.png   1320 × 2868, Slot «iPhone 6,9 Zoll»
//   store-screenshots/6.3/<modus>/<nr>-<szene>.png   1206 × 2622, Slot «iPhone 6,1 / 6,3 Zoll» (verkleinert, macOS sips)
// Gerendert wird mit dem installierten Google Chrome (headless), es braucht keine zusätzlichen Pakete.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { MODES, SCENES } from "./scenes.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const RAW = join(ROOT, ".screenshots/raw");
const HTML = join(ROOT, ".screenshots/html");
const OUT = join(ROOT, "store-screenshots");
const FONTS = join(ROOT, "node_modules/@expo-google-fonts/space-grotesk");
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const WIDTH = 1320;
const HEIGHT = 2868;
// Zweite Ausgabe für den Slot «6,1 / 6,3 Zoll» (1206 × 2622).
const SMALL = { width: 1206, height: 2622 };

// Farben aus src/theme/colors.ts
const THEMES = {
  dark: {
    background: "#121117", text: "#F1EFFA", muted: "#A3A0BA", accent: "#8B93FF", glow: "rgba(139,147,255,0.34)",
    glow2: "rgba(240,171,252,0.16)", bezel: "#05050a", rim: "#3a3750", shadow: "rgba(0,0,0,0.55)",
  },
  light: {
    background: "#F5F3EE", text: "#1F1B3A", muted: "#5E5B75", accent: "#4F46E5", glow: "rgba(195,203,255,0.95)",
    glow2: "rgba(249,211,234,0.8)", bezel: "#14121f", rim: "#c9c4d8", shadow: "rgba(31,27,58,0.28)",
  },
};

const args = process.argv.slice(2);
const modesArg = args.indexOf("--modes") >= 0 ? args[args.indexOf("--modes") + 1].split(",") : MODES;

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
// *Wort* wird in der Akzentfarbe hervorgehoben.
const highlight = (text) => escape(text).replace(/\*(.+?)\*/g, "<em>$1</em>");

function page(scene, rawFile, t) {
  const font = (weight, file) =>
    `@font-face{font-family:"Space Grotesk";font-weight:${weight};src:url("${pathToFileURL(join(FONTS, file))}") format("truetype")}`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${font(500, "500Medium/SpaceGrotesk_500Medium.ttf")}
${font(700, "700Bold/SpaceGrotesk_700Bold.ttf")}
*{box-sizing:border-box;margin:0}
html,body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}
body{position:relative;font-family:"Space Grotesk",sans-serif;color:${t.text};background:
  radial-gradient(1100px 900px at 85% 38%,${t.glow2},transparent 70%),
  radial-gradient(1300px 1100px at 15% 62%,${t.glow},transparent 70%),
  ${t.background}}
header{position:absolute;top:150px;left:0;right:0;text-align:center;padding:0 90px}
h1{text-wrap:balance;font-weight:700;font-size:116px;line-height:1.04;letter-spacing:-0.025em}
h1 em{font-style:normal;color:${t.accent}}
p{text-wrap:balance;margin-top:36px;font-weight:500;font-size:46px;line-height:1.3;color:${t.muted}}
.phone{position:absolute;left:50%;top:640px;width:1060px;margin-left:-530px;padding:16px;border-radius:168px;
  background:${t.bezel};box-shadow:0 0 0 3px ${t.rim},0 70px 140px ${t.shadow}}
.phone img{display:block;width:100%;border-radius:152px}
</style></head><body>
<header><h1>${highlight(scene.title)}</h1><p>${escape(scene.sub)}</p></header>
<div class="phone"><img src="${pathToFileURL(rawFile)}"></div>
</body></html>`;
}

if (!existsSync(CHROME)) throw new Error(`Chrome nicht gefunden (${CHROME}). Pfad über CHROME_PATH setzen.`);
mkdirSync(HTML, { recursive: true });

for (const mode of modesArg) {
  const dir = join(RAW, mode);
  if (!existsSync(dir)) {
    console.error(`Keine Rohaufnahmen für "${mode}" (${dir}). Zuerst: npm run screenshots:capture`);
    process.exit(1);
  }
  const outDir = join(OUT, "6.9", mode);
  const smallDir = join(OUT, "6.3", mode);
  for (const d of [outDir, smallDir]) {
    rmSync(d, { recursive: true, force: true });
    mkdirSync(d, { recursive: true });
  }

  for (const file of readdirSync(dir).filter((f) => f.endsWith(".png")).sort()) {
    const id = file.replace(/^\d+-/, "").replace(/\.png$/, "");
    const scene = SCENES.find((s) => s.id === id);
    if (!scene || scene.storeImage === false) continue;
    const htmlFile = join(HTML, `${mode}-${file}.html`);
    writeFileSync(htmlFile, page(scene, join(dir, file), THEMES[mode]));
    const out = join(outDir, file);
    execFileSync(
      CHROME,
      [
        "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
        `--window-size=${WIDTH},${HEIGHT}`, "--virtual-time-budget=3000", `--screenshot=${out}`,
        pathToFileURL(htmlFile).href,
      ],
      { stdio: "ignore" },
    );
    execFileSync("sips", ["-z", String(SMALL.height), String(SMALL.width), out, "--out", join(smallDir, file)], {
      stdio: "ignore",
    });
    console.log(`${mode}/${file}`);
  }
}
console.log(`Fertig: ${OUT}`);
