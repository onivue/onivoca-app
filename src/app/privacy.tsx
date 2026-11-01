import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Screen } from "../components/Screen";
import { Text } from "../components/Text";
import { colors } from "../theme/colors";

export default function PrivacyScreen() {
  return (
    <Screen title="Datenschutz">
      <Text style={styles.updated}>Stand: 1. November 2026</Text>

      <Section title="Verantwortliche Stelle">
        <Text style={styles.body}>
          [Vor Veröffentlichung den vollständigen Namen oder die Firma, die Postanschrift und eine
          Kontakt-E-Mail-Adresse der verantwortlichen Stelle eintragen.]
        </Text>
      </Section>

      <Section title="Welche Daten die App verarbeitet">
        <Text style={styles.body}>
          Onivoca funktioniert ohne Benutzerkonto. Der Lernfortschritt wird auf deinem Gerät in
          einem lokalen Speicher abgelegt. Die vorinstallierten Lernkarten liegen ebenfalls lokal
          in einer Datenbank. Die App übermittelt diese Angaben nicht an einen Server des
          Entwicklers; es gibt in der App keinen Analyse- oder Werbedienst.
        </Text>
      </Section>

      <Section title="Sprachausgabe">
        <Text style={styles.body}>
          Wenn du die Aussprache abspielst, übergibt die App den Text der Lernkarte an die
          Sprachausgabe von iOS. Die App sendet diesen Text nicht an einen Server des Entwicklers.
          Für die Verarbeitung durch Apple gelten Apples Datenschutzbestimmungen und die
          Einstellungen deines Geräts.
        </Text>
      </Section>

      <Section title="Speicherdauer und Löschen">
        <Text style={styles.body}>
          Dein Lernfortschritt bleibt auf dem Gerät gespeichert, bis du ihn unter «Fortschritt»
          zurücksetzt oder die App löschst. Gerätesicherungen können App-Daten entsprechend deinen
          iOS-Einstellungen enthalten und werden von Apple verwaltet. Die vorinstallierten
          Lernkarten sind App-Inhalte und werden durch das Zurücksetzen des Lernfortschritts nicht
          gelöscht.
        </Text>
      </Section>

      <Section title="Kontakt">
        <Text style={styles.body}>
          [Vor Veröffentlichung eine erreichbare Kontaktadresse für Datenschutzanfragen ergänzen.]
        </Text>
      </Section>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  updated: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  section: { gap: 8 },
  heading: { color: colors.text, fontSize: 18, fontWeight: "600", lineHeight: 24 },
  body: { color: colors.text, fontSize: 15, lineHeight: 23 },
});
