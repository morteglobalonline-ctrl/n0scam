import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { protectionModules } from '@/domain/protection';
import { colors, radius, spacing } from '@/theme';

const actions = [
  { title: 'QR Kod Tara', subtitle: 'Açmadan önce hedefi gör', icon: 'qrcode.viewfinder' as const, route: '/qr-scanner' as const },
  { title: 'Link Analiz Et', subtitle: 'Alan adını ön incele', icon: 'link' as const, route: '/link-analysis' as const },
  { title: 'Mesaj Kontrolü', subtitle: 'Manipülasyon işaretlerini bul', icon: 'text.bubble' as const, route: '/message-analysis' as const },
  { title: 'Koruma Merkezi', subtitle: 'Kapsamı ve boşlukları gör', icon: 'shield.lefthalf.filled' as const, route: '/protection' as const },
];

export default function HomeScreen() {
  return <Screen>
    <View style={{ paddingTop: spacing.md, gap: spacing.sm }}>
      <Image source={require('@/assets/images/n0scam-logo.png')} contentFit="contain" style={{ width: 174, height: 70, alignSelf: 'flex-start' }} accessibilityLabel="n0scam" />
      <N0Text variant="small">Think Before You Trust.</N0Text>
    </View>

    <Surface style={{ gap: spacing.lg, backgroundColor: colors.brandMuted }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={{ width: 48, height: 48, borderRadius: radius.full, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="shield.slash.fill" size={25} /></View>
        <View style={{ flex: 1, gap: spacing.xs }}><N0Text variant="heading">Koruma kurulumu gerekli</N0Text><N0Text variant="small">Hiçbir otomatik kanal henüz canlı olarak doğrulanmadı.</N0Text></View>
      </View>
      <StatusPill tone="warning" label="0 / 5 modül doğrulandı" />
    </Surface>

    <View style={{ gap: spacing.md }}><N0Text variant="heading">Hızlı kontrol</N0Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>{actions.map((action) => <Pressable key={action.title} onPress={() => router.push(action.route)} accessibilityRole="button" style={({ pressed }) => ({ width: '47.8%', minHeight: 142, backgroundColor: colors.surface, borderColor: colors.separator, borderWidth: 1, borderRadius: radius.lg, borderCurve: 'continuous', padding: spacing.lg, gap: spacing.md, opacity: pressed ? 0.72 : 1 })}><N0Symbol name={action.icon} size={28} /><View style={{ gap: spacing.xs }}><N0Text variant="headline">{action.title}</N0Text><N0Text variant="caption">{action.subtitle}</N0Text></View></Pressable>)}</View></View>

    <View style={{ gap: spacing.md }}><View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><N0Text variant="heading">Koruma kanalları</N0Text><Pressable onPress={() => router.push('/protection')} hitSlop={12}><N0Text variant="small" style={{ color: colors.brand }}>Tümünü gör</N0Text></Pressable></View><Surface style={{ padding: 0 }}>{protectionModules.slice(0, 3).map((module, index) => <Pressable key={module.id} onPress={() => router.push({ pathname: '/module/[id]', params: { id: module.id } })} style={({ pressed }) => ({ padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderBottomWidth: index < 2 ? 1 : 0, borderBottomColor: colors.separator, opacity: pressed ? 0.65 : 1 })}><N0Symbol name={module.id === 'safari' ? 'safari' : 'envelope.fill'} /><View style={{ flex: 1, gap: 2 }}><N0Text variant="headline">{module.name}</N0Text><N0Text variant="caption">{module.summary}</N0Text></View><StatusPill label="Kapalı" /></Pressable>)}</Surface></View>
  </Screen>;
}
