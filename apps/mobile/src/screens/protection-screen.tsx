import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { VendorIcon } from '@/components/vendor-icon';
import { getMailConnectionHealth, protectionModules } from '@/domain/protection';
import { useMailProtectionStatuses } from '@/hooks/use-mail-protection';
import { useSafariExtensionState } from '@/hooks/use-safari-protection';
import { useSmsProtectionHeartbeat } from '@/hooks/use-sms-protection';
import { colors } from '@/theme';

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
  const smsHeartbeat = useSmsProtectionHeartbeat();
  const mailStatuses = useMailProtectionStatuses();
  const safariState = useSafariExtensionState();
  const gmailHealth = getMailConnectionHealth(mailStatuses.gmail);
  const outlookHealth = getMailConnectionHealth(mailStatuses.outlook);
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/');
  return <Screen contentContainerStyle={{ paddingTop: insets.top + 8, gap: 10 }}>
    <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><Pressable onPress={goBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Geri" style={{ position: 'absolute', left: 0 }}><N0Symbol name="arrow.left" size={26} tintColor={colors.text} /></Pressable><N0Text variant="title">Koruma Merkezi</N0Text></View>
    <View style={{ gap: 0 }}>{protectionModules.map((module, index) => { const smsVerified = module.id === 'sms' && smsHeartbeat?.fresh; const mailHealth = module.id === 'gmail' ? gmailHealth : module.id === 'outlook' ? outlookHealth : null; const mailVerified = mailHealth === 'VERIFIED'; const mailDegraded = mailHealth === 'DEGRADED'; const safariEnabled = module.id === 'safari' && safariState === 'ENABLED'; return <Pressable key={module.id} onPress={() => router.push({ pathname: '/module/[id]', params: { id: module.id } })} style={({ pressed }) => ({ opacity: pressed ? 0.68 : 1, marginTop: index === 0 ? 0 : -1 })}><Surface style={{ minHeight: 79, borderRadius: index === 0 || index === protectionModules.length - 1 ? 16 : 12, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16 }}><VendorIcon vendor={vendorFor(module.id)} size={48} /><View style={{ flex: 1, gap: 3 }}><N0Text variant="headline" style={{ fontSize: 14 }}>{module.name === 'Ağ Koruması' ? 'Ağ Koruması (VPN)' : module.name === 'Mesaj Koruması' ? 'Mesaj Koruması (SMS)' : module.name}</N0Text><N0Text variant="small">{descriptionFor(module.id)}</N0Text></View><StatusPill tone={smsVerified || mailVerified || safariEnabled ? 'brand' : mailDegraded || module.state === 'NOT_SUPPORTED' ? 'warning' : 'neutral'} label={smsVerified ? 'Son olay doğrulandı' : mailVerified ? 'Bağlı' : mailDegraded ? 'Kontrol gerekli' : safariEnabled ? 'Etkin' : module.id === 'sms' || module.id === 'safari' ? 'Yapılandır' : module.state === 'NOT_SUPPORTED' ? 'Yakında' : 'Bağla'} /></Surface></Pressable>; })}</View>
    <N0Text variant="caption" style={{ textAlign: 'center', paddingTop: 2 }}>Modüller canlı doğrulama olmadan aktif gösterilmez.</N0Text>
  </Screen>;
}
