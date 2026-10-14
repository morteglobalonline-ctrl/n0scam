import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { BrandWordmark } from '@/components/brand-wordmark';
import { GroupedRow } from '@/components/grouped-row';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { protectionModules } from '@/domain/protection';
import { colors, radius, shadows } from '@/theme';

const actions = [
  { title: 'QR Kod Tara', icon: 'qrcode.viewfinder' as const, route: '/qr-scanner' as const },
  { title: 'Link Analiz Et', icon: 'link' as const, route: '/link-analysis' as const },
  { title: 'Mesaj / E-posta', icon: 'text.bubble.fill' as const, route: '/message-analysis' as const },
  { title: 'Fotoğraf Analiz Et', icon: 'photo.fill' as const, route: '/qr-scanner' as const },
];

const moduleIcon = (id: string) => id === 'safari' ? 'safari' as const : id === 'sms' ? 'message.fill' as const : id === 'network' ? 'network' as const : 'envelope.fill' as const;

export default function HomeScreen() {
  return <Screen>
    <View style={{ minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <BrandWordmark compact />
      <Pressable onPress={() => router.push('/settings')} hitSlop={12} accessibilityRole="button" accessibilityLabel="Ayarlar" style={({ pressed }) => ({ opacity: pressed ? 0.55 : 1 })}><N0Symbol name="gearshape.fill" size={18} tintColor={colors.textSecondary} /></Pressable>
    </View>

    <Surface style={{ minHeight: 186, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.brandWash, borderColor: '#12533B' }}>
      <View style={{ position: 'absolute', width: 210, height: 210, borderRadius: radius.full, backgroundColor: 'rgba(0,255,138,0.035)' }} />
      <View style={{ width: 70, height: 70, borderRadius: radius.full, borderWidth: 1, borderColor: colors.brand, backgroundColor: '#04100C', alignItems: 'center', justifyContent: 'center', boxShadow: shadows.glow }}><N0Symbol name="checkmark.shield.fill" size={34} /></View>
      <N0Text variant="heading" style={{ color: colors.brand, marginTop: 3 }}>Ön Koruma Hazır</N0Text>
      <N0Text variant="caption" style={{ textAlign: 'center', maxWidth: 260 }}>Manuel tarama araçları hazır. Otomatik kanallar için kurulum gerekir.</N0Text>
      <StatusPill tone="brand" label="3 manuel araç kullanılabilir" />
    </Surface>

    <View style={{ gap: 9 }}>
      <N0Text variant="headline">Hızlı İşlemler</N0Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>{actions.map((action) => <Pressable key={action.title} onPress={() => router.push(action.route)} accessibilityRole="button" style={({ pressed }) => ({ width: '48.6%', minHeight: 88, backgroundColor: colors.surface, borderColor: pressed ? colors.brand : colors.separator, borderWidth: 1, borderRadius: radius.md, borderCurve: 'continuous', padding: 11, justifyContent: 'space-between', opacity: pressed ? 0.72 : 1 })}>
        <N0Symbol name={action.icon} size={21} />
        <N0Text variant="headline" style={{ fontSize: 11.5 }}>{action.title}</N0Text>
      </Pressable>)}</View>
    </View>

    <View style={{ gap: 9 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><N0Text variant="headline">Koruma Modülleri</N0Text><Pressable onPress={() => router.push('/protection')} hitSlop={12}><N0Text variant="caption" style={{ color: colors.brand }}>Tümünü Gör</N0Text></Pressable></View>
      <Surface style={{ padding: 0 }}>{protectionModules.slice(0, 4).map((module, index, list) => <GroupedRow key={module.id} icon={moduleIcon(module.id)} title={module.name} detail={module.summary} last={index === list.length - 1} onPress={() => router.push({ pathname: '/module/[id]', params: { id: module.id } })} trailing={<StatusPill label="Kapalı" />} />)}</Surface>
    </View>
  </Screen>;
}
