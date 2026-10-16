import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandWordmark } from '@/components/brand-wordmark';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { VendorIcon } from '@/components/vendor-icon';
import { getMailConnectionHealth, protectionModules } from '@/domain/protection';
import { useMailProtectionStatuses } from '@/hooks/use-mail-protection';
import { useSmsProtectionHeartbeat } from '@/hooks/use-sms-protection';
import { colors, radius, shadows, spacing } from '@/theme';

const actions = [
  { title: 'QR Kod\nTara', icon: 'qrcode.viewfinder' as const, route: '/qr-scanner' as const },
  { title: 'Link\nAnaliz Et', icon: 'link' as const, route: '/link-analysis' as const },
  { title: 'Mesaj / E-posta\nKontrol Et', icon: 'doc.text.fill' as const, route: '/message-analysis' as const },
  { title: 'Fotoğraf\nAnaliz Et', icon: 'photo.fill' as const, route: '/qr-scanner' as const },
];

const vendorFor = (id: string) => id as 'gmail' | 'outlook' | 'safari' | 'chrome' | 'sms';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const smsHeartbeat = useSmsProtectionHeartbeat();
  const mailStatuses = useMailProtectionStatuses();
  const gmailHealth = getMailConnectionHealth(mailStatuses.gmail);
  const outlookHealth = getMailConnectionHealth(mailStatuses.outlook);
  const verifiedCount = Number(Boolean(smsHeartbeat?.fresh)) + Number(gmailHealth === 'VERIFIED') + Number(outlookHealth === 'VERIFIED');
  const homeModules = protectionModules.filter((module) => ['gmail', 'outlook', 'safari', 'chrome', 'sms'].includes(module.id));
  return <Screen contentContainerStyle={{ paddingTop: insets.top + 8, gap: 12 }}>
    <View style={{ minHeight: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <BrandWordmark />
      <Pressable onPress={() => router.push('/settings')} hitSlop={12} accessibilityRole="button" accessibilityLabel="Ayarlar" style={({ pressed }) => ({ width: 38, height: 38, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.55 : 1 })}><N0Symbol name="gearshape" size={27} tintColor={colors.text} /></Pressable>
    </View>

    <Surface style={{ minHeight: 180, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#00130D', borderColor: colors.border }}>
      <View style={{ position: 'absolute', width: 250, height: 250, borderRadius: radius.full, backgroundColor: 'rgba(0,255,138,0.035)' }} />
      <View style={{ width: 84, height: 84, borderRadius: radius.full, borderWidth: 2, borderColor: colors.brand, backgroundColor: '#001009', alignItems: 'center', justifyContent: 'center', boxShadow: shadows.glow }}><N0Symbol name={verifiedCount ? 'checkmark.shield.fill' : 'shield.slash.fill'} size={39} /></View>
      <N0Text variant="heading" style={{ color: colors.brand, fontSize: 18 }}>{verifiedCount ? 'Koruma Kısmen Aktif' : 'Koruma Kurulumu Gerekli'}</N0Text>
      <N0Text variant="small" style={{ color: colors.textSecondary, textAlign: 'center' }}>{verifiedCount ? `${verifiedCount} modül yakın zamanda doğrulandı. Diğer modüller için kuruluma devam edin.` : 'Manuel tarama hazır. Otomatik modüller henüz bağlı değil.'}</N0Text>
    </Surface>

    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>{actions.map((action) => <Pressable key={action.title} onPress={() => router.push(action.route)} accessibilityRole="button" style={({ pressed }) => ({ width: '48.6%', minHeight: 105, backgroundColor: '#02130E', borderColor: pressed ? colors.brand : colors.border, borderWidth: 1, borderRadius: radius.lg, borderCurve: 'continuous', padding: spacing.md, alignItems: 'center', justifyContent: 'center', gap: 9, boxShadow: '0 0 20px rgba(0,255,138,0.045)', opacity: pressed ? 0.68 : 1 })}>
      <N0Symbol name={action.icon} size={31} />
      <N0Text variant="headline" style={{ textAlign: 'center', fontSize: 13, lineHeight: 18 }}>{action.title}</N0Text>
    </Pressable>)}</View>

    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><N0Text variant="heading">Koruma Modülleri</N0Text><Pressable onPress={() => router.push('/protection')} hitSlop={12} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><N0Text variant="small" style={{ color: colors.brand }}>Tümünü Gör</N0Text><N0Symbol name="chevron.right" size={11} /></Pressable></View>
      <Surface style={{ padding: 0, overflow: 'hidden' }}>{homeModules.map((module, index) => { const smsVerified = module.id === 'sms' && smsHeartbeat?.fresh; const mailHealth = module.id === 'gmail' ? gmailHealth : module.id === 'outlook' ? outlookHealth : null; const mailVerified = mailHealth === 'VERIFIED'; const mailDegraded = mailHealth === 'DEGRADED'; return <Pressable key={module.id} onPress={() => router.push({ pathname: '/module/[id]', params: { id: module.id } })} style={({ pressed }) => ({ minHeight: 58, paddingHorizontal: 11, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: index === homeModules.length - 1 ? 0 : 1, borderBottomColor: colors.separator, opacity: pressed ? 0.65 : 1 })}><VendorIcon vendor={vendorFor(module.id)} size={38} /><View style={{ flex: 1, gap: 1 }}><N0Text variant="headline">{module.name}</N0Text><N0Text variant="caption">{module.id === 'gmail' || module.id === 'outlook' ? 'E-posta taraması' : module.id === 'sms' ? 'Şüpheli mesajları analiz eder' : 'Tarayıcı uzantısı'}</N0Text></View><StatusPill tone={smsVerified || mailVerified ? 'brand' : mailDegraded ? 'warning' : 'neutral'} label={smsVerified ? 'Doğrulandı' : mailVerified ? 'Bağlı' : mailDegraded ? 'Kontrol gerekli' : module.id === 'sms' ? 'Yapılandır' : 'Bağla'} /></Pressable>; })}</Surface>
    </View>
  </Screen>;
}
