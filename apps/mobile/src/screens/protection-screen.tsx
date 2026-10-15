import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { VendorIcon } from '@/components/vendor-icon';
import { protectionModules } from '@/domain/protection';
import { colors, spacing } from '@/theme';

const vendorFor = (id: string) => id as 'gmail' | 'outlook' | 'safari' | 'chrome' | 'sms' | 'network' | 'family';
const descriptionFor = (id: string) => {
  if (id === 'gmail' || id === 'outlook') return 'E-posta taraması';
  if (id === 'sms') return 'Bilinmeyen SMS/MMS filtresi';
  if (id === 'network') return 'Zararlı siteleri engeller';
  if (id === 'family') return 'Aile üyeleri için koruma';
  return 'Tarayıcı uzantısı';
};

export default function ProtectionScreen() {
  const insets = useSafeAreaInsets();
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/');
  return <Screen contentContainerStyle={{ paddingTop: insets.top + 8, gap: 10 }}>
    <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><Pressable onPress={goBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Geri" style={{ position: 'absolute', left: 0 }}><N0Symbol name="arrow.left" size={26} tintColor={colors.text} /></Pressable><N0Text variant="title">Koruma Merkezi</N0Text></View>
    <View style={{ gap: 0 }}>{protectionModules.map((module, index) => <Pressable key={module.id} onPress={() => router.push({ pathname: '/module/[id]', params: { id: module.id } })} style={({ pressed }) => ({ opacity: pressed ? 0.68 : 1, marginTop: index === 0 ? 0 : -1 })}><Surface style={{ minHeight: 79, borderRadius: index === 0 || index === protectionModules.length - 1 ? 16 : 12, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16 }}><VendorIcon vendor={vendorFor(module.id)} size={48} /><View style={{ flex: 1, gap: 3 }}><N0Text variant="headline" style={{ fontSize: 14 }}>{module.name === 'Ağ Koruması' ? 'Ağ Koruması (VPN)' : module.name === 'Mesaj Koruması' ? 'Mesaj Koruması (SMS)' : module.name}</N0Text><N0Text variant="small">{descriptionFor(module.id)}</N0Text></View><StatusPill tone={module.state === 'NOT_SUPPORTED' ? 'warning' : 'neutral'} label={module.id === 'sms' || module.id === 'safari' ? 'Yapılandır' : module.state === 'NOT_SUPPORTED' ? 'Yakında' : 'Bağla'} /></Surface></Pressable>)}</View>
    <Pressable onPress={() => router.push('/pro')} style={({ pressed }) => ({ opacity: pressed ? 0.68 : 1, paddingTop: spacing.sm })}><Surface style={{ minHeight: 106, flexDirection: 'row', alignItems: 'center', gap: 17, paddingHorizontal: 20 }}><N0Symbol name="person.2.fill" size={41} /><View style={{ flex: 1, gap: 5 }}><N0Text variant="headline" style={{ fontSize: 15 }}>Aile Koruması</N0Text><N0Text variant="small" style={{ fontSize: 12 }}>Sevdiklerinizin de güvende olmasına yardımcı olun.</N0Text></View><N0Symbol name="chevron.right" size={18} tintColor={colors.text} /></Surface></Pressable>
    <N0Text variant="caption" style={{ textAlign: 'center', paddingTop: 2 }}>Modüller canlı doğrulama olmadan aktif gösterilmez.</N0Text>
  </Screen>;
}
