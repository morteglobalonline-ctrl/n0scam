import { usePathname } from 'expo-router';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabItem, tabBarStyle, tabs } from '@/components/brand-tab-bar';
import { colors } from '@/theme';

export default function TabsLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  return <Tabs style={{ flex: 1, backgroundColor: colors.background }}><TabSlot style={{ flex: 1 }} /><TabList asChild><View style={tabBarStyle(insets.bottom)}>{tabs.map((tab) => <TabTrigger key={tab.name} name={tab.name} href={tab.href} style={{ flex: 1 }}><TabItem label={tab.label} icon={tab.icon} active={pathname === tab.href} /></TabTrigger>)}</View></TabList></Tabs>;
}
