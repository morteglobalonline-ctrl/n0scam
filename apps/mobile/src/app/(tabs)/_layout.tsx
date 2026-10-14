import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { colors } from '@/theme';

export default function TabsLayout() {
  return <NativeTabs backgroundColor={colors.backgroundElevated} iconColor={{ default: colors.textMuted, selected: colors.brand }} indicatorColor={colors.brandMuted} labelStyle={{ default: { color: colors.textMuted }, selected: { color: colors.brand } }} tintColor={colors.brand}>
    <NativeTabs.Trigger name="index"><NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" /><NativeTabs.Trigger.Label>Ana Sayfa</NativeTabs.Trigger.Label></NativeTabs.Trigger>
    <NativeTabs.Trigger name="scan"><NativeTabs.Trigger.Icon sf="viewfinder" md="search" /><NativeTabs.Trigger.Label>Tarama</NativeTabs.Trigger.Label></NativeTabs.Trigger>
    <NativeTabs.Trigger name="protection"><NativeTabs.Trigger.Icon sf={{ default: 'shield', selected: 'shield.fill' }} md="shield" /><NativeTabs.Trigger.Label>Koruma</NativeTabs.Trigger.Label></NativeTabs.Trigger>
    <NativeTabs.Trigger name="history"><NativeTabs.Trigger.Icon sf="clock.arrow.circlepath" md="history" /><NativeTabs.Trigger.Label>Geçmiş</NativeTabs.Trigger.Label></NativeTabs.Trigger>
    <NativeTabs.Trigger name="settings"><NativeTabs.Trigger.Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} md="settings" /><NativeTabs.Trigger.Label>Ayarlar</NativeTabs.Trigger.Label></NativeTabs.Trigger>
  </NativeTabs>;
}
