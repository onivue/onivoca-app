// Die Szenen für die Store-Screenshots: was in der App aufgenommen wird (url, pre, storage)
// und welcher Text im Store-Bild darüber steht (title, sub; Wörter in *Sternchen* sind farbig).
//
// path:     Deep-Link, der die Szene öffnet (Schema "onivoca", siehe app.json).
// pre:     optionaler Link vorher, damit die Seite wie im echten Gebrauch aufgeschoben wird (Zurück-Pfeil).
// storage: überschreibt AsyncStorage-Werte für diese Szene (z. B. Sprache).
// Lernseite: ?card=<id>&flipped=1&summary=<ids> gelten nur im Screenshot-Build, siehe src/lib/screenshot.ts.

const SUMMARY_WORDS = ["embrace", "vivacious", "gorge", "jealousy", "perk", "leverage", "meadow", "envy"];

export const SCENES = [
  {
    id: "learn-front",
    path: "/?card=embrace",
    title: "Vokabeln lernen, *ohne Stress*",
    sub: "Karteikarten in kurzen Runden, ohne Fristen und ohne Druck.",
  },
  {
    id: "learn-back",
    path: "/?card=embrace&flipped=1",
    title: "Alles zum Wort *auf einer Karte*",
    sub: "Bedeutung, Beispiele, Merkhilfe und Wortnetz.",
  },
  {
    id: "summary",
    path: `/?summary=${SUMMARY_WORDS.join(",")}`,
    title: "Deine Runde *auf einen Blick*",
    sub: "Sieh, was sitzt und was du nochmal üben solltest.",
  },
  {
    id: "words",
    path: "/words",
    title: "Wörter *durchstöbern*",
    sub: "Mit Suche, Filtern und Lernstand zu jedem Wort.",
  },
  {
    id: "word-detail",
    pre: "/words",
    path: "/word/gorge",
    title: "Jedes Wort *richtig verstehen*",
    sub: "Beispielsätze, Aussprache und verwandte Wörter.",
  },
  {
    id: "difficulty",
    pre: "/settings",
    path: "/settings/difficulty",
    title: "Dein Level, *dein Mix*",
    sub: "Mische die Stufen A1 bis C2, so wie es für dich passt.",
  },
  {
    id: "progress",
    pre: "/settings",
    path: "/settings/progress",
    title: "Sieh, wie du *vorankommst*",
    sub: "Neu, am Lernen oder gelernt: dein Stand auf einen Blick.",
  },
  {
    id: "spanish",
    path: "/?card=es-casa-noun",
    storage: { "learn-language-v1": "es" },
    title: "Englisch *und Spanisch*",
    sub: "Wechsle die Sprache jederzeit, jede mit eigenem Lernstand.",
  },
  // Nur für App Store Connect (Prüfbild des In-App-Kaufs), kein Store-Bild: Einstellungen mit dem Bereich «Werbung».
  { id: "iap-review", path: "/settings", storeImage: false },
];

// Hell und dunkel; dunkel ist der bevorzugte Look (steht zuerst).
export const MODES = ["dark", "light"];
