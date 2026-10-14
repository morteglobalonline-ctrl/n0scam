import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { colors } from '@/theme';

export const tabs = [
  { name: 'home', href: '/' as const, label: 'Ana Sayfa', icon: 'house.fill' as const },
  { name: 'scan', href: '/scan' as const, label: 'Tarama', icon: 'viewfinder' as const },
  { name: 'protection', href: '/protection' as const, label: 'Koruma', icon: 'checkmark.shield.fill' as const },
  { name: 'history', href: '/history' as const, label: 'Geçmiş', icon: 'clock' as const },
  { name: 'settings', href: '/settings' as const, label: 'Ayarlar', icon: 'gearshape' as const },
];

export function TabItem({ label, icon, active }: { label: string; icon: (typeof tabs)[number]['icon']; active: boolean }) {
  return <View style={{ flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: 3 }}><N0Symbol name={icon} size={23} tintColor={active ? colors.brand : colors.textSecondary} /><N0Text variant="caption" style={{ color: active ? colors.brand : colors.textSecondary, fontSize: 9 }}>{label}</N0Text></View>;
}

export function tabBarStyle(bottomInset: number) {
  return { height: 58 + bottomInset, paddingBottom: bottomInset, flexDirection: 'row' as const, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.separator };
}

export function StandaloneTabBar({ active = 'scan' }: { active?: (typeof tabs)[number]['name'] }) {
  const insets = useSafeAreaInsets();
  return <View style={tabBarStyle(insets.bottom)}>{tabs.map((tab) => <Pressable key={tab.name} onPress={() => router.replace(tab.href)} accessibilityRole="tab" accessibilityState={{ selected: tab.name === active }} style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.58 : 1 })}><TabItem label={tab.label} icon={tab.icon} active={tab.name === active} /></Pressable>)}</View>;
}
