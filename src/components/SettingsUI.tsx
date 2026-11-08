import { ChevronRight, LucideIcon } from "lucide-react-native";
import { Children, ReactNode } from "react";
import { Pressable, View } from "react-native";
import { colors } from "../theme/colors";
import { themed, useTheme } from "../theme/theme";
import { Text } from "./Text";

// Bausteine der Einstellungen: Gruppen mit Zeilen (wie in iOS), Felder mit Auswahl und Karten für Unterseiten.

type Tint = "accent" | "sky" | "orange" | "pink" | "success" | "warning" | "primary" | "danger";

// Getter, damit die Farben beim Rendern im aktuellen Design gelesen werden.
const TINTS: Record<Tint, { bg: string; fg: string }> = {
  accent: { get bg() { return colors.accent; }, get fg() { return colors.onAccent; } },
  sky: { get bg() { return colors.sky; }, get fg() { return colors.onSky; } },
  orange: { get bg() { return colors.orange; }, get fg() { return colors.onOrange; } },
  pink: { get bg() { return colors.pink; }, get fg() { return colors.onPink; } },
  success: { get bg() { return colors.success; }, get fg() { return colors.onSuccess; } },
  warning: { get bg() { return colors.warning; }, get fg() { return colors.onWarning; } },
  primary: { get bg() { return colors.primary; }, get fg() { return colors.onPrimary; } },
  danger: { get bg() { return colors.danger; }, get fg() { return colors.onDanger; } },
};

// Gruppe mit Überschrift; Zeilen werden durch feine Linien getrennt.
export function SettingsGroup({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  useTheme();
  const items = Children.toArray(children).filter(Boolean);
  return (
    <View style={styles.group}>
      {title && <Text style={styles.groupTitle}>{title}</Text>}
      <View style={styles.groupCard}>
        {items.map((child, i) => (
          <View key={i}>
            {i > 0 && <View style={styles.separator} />}
            {child}
          </View>
        ))}
      </View>
      {footer && <Text style={styles.groupFooter}>{footer}</Text>}
    </View>
  );
}

function IconBadge({ Icon, tint }: { Icon: LucideIcon; tint: Tint }) {
  useTheme();
  return (
    <View style={[styles.iconBadge, { backgroundColor: TINTS[tint].bg }]}>
      <Icon color={TINTS[tint].fg} size={17} />
    </View>
  );
}

// Zeile, die eine Unterseite öffnet oder etwas auslöst. Rechts steht der aktuelle Wert.
export function SettingsRow({
  Icon,
  tint = "accent",
  label,
  value,
  onPress,
  destructive,
  accessory,
}: {
  Icon: LucideIcon;
  tint?: Tint;
  label: string;
  value?: string;
  onPress?: () => void; // ohne onPress ist die Zeile reine Anzeige (kein Pfeil)
  destructive?: boolean;
  accessory?: ReactNode;
}) {
  useTheme();
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && onPress && styles.rowPressed]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityLabel={value ? `${label}: ${value}` : label}
    >
      <IconBadge Icon={Icon} tint={tint} />
      <Text style={[styles.rowLabel, destructive && styles.rowDestructive]}>{label}</Text>
      {accessory}
      {value && (
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      )}
      {!destructive && onPress && <ChevronRight color={colors.muted} size={18} />}
    </Pressable>
  );
}

// Zeile mit Auswahl direkt darunter (z. B. Sprache, Design).
export function SettingsField({ Icon, tint = "accent", label, children }: { Icon: LucideIcon; tint?: Tint; label: string; children: ReactNode }) {
  useTheme();
  return (
    <View style={styles.field}>
      <View style={styles.fieldHead}>
        <IconBadge Icon={Icon} tint={tint} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

// Karte mit Überschrift für Inhalte auf Unterseiten.
export function SettingsCard({ title, hint, children }: { title?: string; hint?: string; children: ReactNode }) {
  useTheme();
  return (
    <View style={styles.card}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      {hint && <Text style={styles.hint}>{hint}</Text>}
      {children}
    </View>
  );
}

// Auswahl in einer Reihe: jede Option ist gleich breit, die gewählte ist hervorgehoben.
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
}) {
  useTheme();
  return (
    <View style={styles.segmented}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            style={[styles.segment, selected && styles.segmentSelected]}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            {option.icon}
            <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = themed(() => ({
  group: { gap: 8 },
  groupTitle: { fontSize: 13, fontWeight: "600", color: colors.muted, textTransform: "uppercase", letterSpacing: 0.4, paddingHorizontal: 4 },
  groupCard: { backgroundColor: colors.card, borderRadius: 20, overflow: "hidden" },
  groupFooter: { fontSize: 13, lineHeight: 18, color: colors.muted, paddingHorizontal: 4 },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 58 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13, paddingHorizontal: 16, minHeight: 54 },
  rowPressed: { backgroundColor: colors.background },
  iconBadge: { width: 30, height: 30, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: "500", color: colors.text },
  rowDestructive: { color: "#E11D48" },
  rowValue: { fontSize: 15, color: colors.muted, maxWidth: "45%" },
  field: { paddingVertical: 13, paddingHorizontal: 16, gap: 12 },
  fieldHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  card: { backgroundColor: colors.card, borderRadius: 24, padding: 20, gap: 14 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  hint: { fontSize: 14, lineHeight: 20, color: colors.muted },
  segmented: { flexDirection: "row", gap: 4, backgroundColor: colors.background, borderRadius: 14, padding: 4 },
  segment: { flex: 1, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 11 },
  segmentSelected: { backgroundColor: colors.accent },
  segmentText: { fontSize: 15, fontWeight: "600", color: colors.muted },
  segmentTextSelected: { color: colors.onAccent },
}));
