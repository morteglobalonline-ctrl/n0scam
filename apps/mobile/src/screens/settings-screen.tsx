import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { colors, radius } from '@/theme';

const rows = [
  { id: 'subscription', title: 'Hesap ve Abonelik', detail: 'Ücretsiz geliştirme sürümü', icon: 'person.crop.square' as const, route: '/pro' as const },
  { id: 'connections', title: 'Bağlı Hesaplar', icon: 'person.2.fill' as const, route: null },
  { id: 'privacy', title: 'Gizlilik ve Güvenlik', icon: 'lock.shield.fill' as const, route: '/privacy' as const },
  { id: 'notifications', title: 'Bildirim Ayarları', icon: 'bell.fill' as const, route: null },
  { id: 'language', title: 'Uygulama Dili', value: 'Türkçe', icon: 'globe' as const, route: null },
  { id: 'appearance', title: 'Tema', value: 'Koyu', icon: 'paintpalette.fill' as const, route: null },
  { id: 'support', title: 'Destek', icon: 'questionmark.circle.fill' as const, route: null },
  { id: 'about', title: 'Hakkında', icon: 'info.circle.fill' as const, route: null },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  return <Screen contentContainerStyle={{ paddingTop: insets.top + 12, gap: 9 }}>
    <N0Text variant="title" style={{ fontSize: 27, paddingBottom: 4 }}>Ayarlar</N0Text>
    <Pressable onPress={() => router.push({ pathname: '/setting/[id]', params: { id: 'account' } })} style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })}><Surface style={{ minHeight: 83, flexDirection: 'row', alignItems: 'center', gap: 15, paddingHorizontal: 15 }}><View style={{ width: 55, height: 55, borderRadius: radius.full, backgroundColor: '#4C5350', alignItems: 'center', justifyContent: 'center' }}><N0Text variant="title" style={{ fontFamily: 'Sora_400Regular', fontSize: 23 }}>K</N0Text></View><View style={{ flex: 1, gap: 2 }}><N0Text variant="headline" style={{ fontSize: 14 }}>Kullanıcı</N0Text><N0Text variant="small">Hesap bilgisi bağlı değil</N0Text></View><N0Symbol name="chevron.right" size={16} tintColor={colors.text} /></Surface></Pressable>
    {rows.map((row) => <Pressable key={row.id} onPress={() => row.route ? router.push(row.route) : router.push({ pathname: '/setting/[id]', params: { id: row.id } })} style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })}><Surface style={{ minHeight: 67, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 14 }}><View style={{ width: 43, height: 43, borderRadius: radius.full, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: '#2A3733', alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={row.icon} size={21} tintColor={colors.text} /></View><View style={{ flex: 1, gap: 2 }}><N0Text variant="headline" style={{ fontSize: 13.5 }}>{row.title}</N0Text>{row.detail ? <N0Text variant="small">{row.detail}</N0Text> : null}</View>{row.value ? <N0Text variant="small" style={{ color: colors.textSecondary }}>{row.value}</N0Text> : null}<N0Symbol name="chevron.right" size={15} tintColor={colors.text} /></Surface></Pressable>)}
  </Screen>;
}
