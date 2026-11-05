// Zentrale Farben. `colors` ist veränderlich: applyScheme() (theme/theme.tsx) schreibt die Werte
// des aktiven Designs hinein. Gelesen wird immer beim Rendern, nie beim Laden des Moduls.
export type Palette = {
  background: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  primary: string;
  danger: string;
  success: string;
  warning: string;
  // Schriftfarben auf den farbigen Flächen
  onAccent: string;
  onText: string;
  onPrimary: string;
  onDanger: string;
  onSuccess: string;
  onWarning: string;
  // Halbtransparente Fläche auf farbigem Grund (Badges, Buttons)
  overlay: string;
  // Zusatzfarben für Kacheln
  orange: string;
  onOrange: string;
  sky: string;
  onSky: string;
  pink: string;
  onPink: string;
  backdrop: string;
};

// Hell: warmer Hintergrund, dunkle Schrift, Pastell für Flächen, kräftiges Indigo als Akzent.
export const lightColors: Palette = {
  background: "#F5F3EE",
  card: "#FFFFFF",
  text: "#1F1B3A",
  muted: "#5E5B75",
  border: "#E6E2D8",
  accent: "#4F46E5",
  primary: "#C3CBFF",
  danger: "#FFC2C7",
  success: "#A8E6BE",
  warning: "#FFE08A",
  onAccent: "#FFFFFF",
  onText: "#FFFFFF",
  onPrimary: "#30365B",
  onDanger: "#67323A",
  onSuccess: "#24523A",
  onWarning: "#614A16",
  overlay: "rgba(255,255,255,0.6)",
  orange: "#FFDCC2",
  onOrange: "#7C2D12",
  sky: "#BFE9FB",
  onSky: "#0C4A6E",
  pink: "#F9D3EA",
  onPink: "#831843",
  backdrop: "rgba(0,0,0,0.4)",
};

// Dunkel: tiefes Blauviolett, Flächen als gedeckte Töne, helle Akzente.
export const darkColors: Palette = {
  background: "#121117",
  card: "#1E1C27",
  text: "#F1EFFA",
  muted: "#A3A0BA",
  border: "#34304A",
  accent: "#8B93FF",
  primary: "#38407F",
  danger: "#7A2F3A",
  success: "#1F5A3C",
  warning: "#6B5416",
  onAccent: "#14121F",
  onText: "#121117",
  onPrimary: "#DDE1FF",
  onDanger: "#FFD9DD",
  onSuccess: "#CFF5DD",
  onWarning: "#FFEDB8",
  overlay: "rgba(255,255,255,0.12)",
  orange: "#5A3118",
  onOrange: "#FFDCC2",
  sky: "#1A4256",
  onSky: "#C7EDFF",
  pink: "#57244A",
  onPink: "#FBD5EC",
  backdrop: "rgba(0,0,0,0.6)",
};

export const colors: Palette = { ...lightColors };
