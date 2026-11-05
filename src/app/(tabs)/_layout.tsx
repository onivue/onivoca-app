import { NativeTabs } from "expo-router/native-tabs";

// Native iOS-Tab-Leiste (UITabBar): ab iOS 26 automatisch im Liquid-Glass-Look.
// Native Tabs nutzen SF Symbols statt Lucide-Icons.
export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Lernen</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="rectangle.stack.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="words">
        <NativeTabs.Trigger.Label>Wörter</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="books.vertical.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Einstellungen</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
