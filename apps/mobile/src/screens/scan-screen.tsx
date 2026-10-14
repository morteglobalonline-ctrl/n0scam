import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { GroupedRow } from '@/components/grouped-row';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { colors, radius, spacing } from '@/theme';

const scanModes = [
  { title: 'QR Kod Tara', detail: 'Kameradan veya fotoğraftan, hedefi açmadan.', icon: 'qrcode.viewfinder' as const, route: '/qr-scanner' as const },
  { title: 'Link Analiz Et', detail: 'URL yapısını ve aldatıcı işaretleri incele.', icon: 'link' as const, route: '/link-analysis' as const },
  { title: 'Mesaj / E-posta Kontrol Et', detail: 'Metindeki baskı ve bilgi taleplerini bul.', icon: 'text.bubble.fill' as const, route: '/message-analysis' as const },
];

export default function ScanScreen() {
  return <Screen>
    <View style={{ alignItems: 'center', gap: 5, paddingTop: spacing.sm }}><View style={{ width: 48, height: 48, borderRadius: radius.full, borderWidth: 1, borderColor: colors.brand, backgroundColor: colors.brandWash, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="viewfinder" size={25} /></View><N0Text variant="title">Tarama</N0Text><N0Text variant="small" style={{ textAlign: 'center' }}>Kontrol türünü seç. İçerik iznin olmadan açılmaz.</N0Text></View>
    <Surface style={{ padding: 0 }}>{scanModes.map((mode, index) => <GroupedRow key={mode.title} icon={mode.icon} title={mode.title} detail={mode.detail} last={index === scanModes.length - 1} onPress={() => router.push(mode.route)} />)}</Surface>
    <Pressable onPress={() => router.push('/qr-scanner')} style={({ pressed }) => ({ minHeight: 154, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.brand, backgroundColor: colors.brandWash, alignItems: 'center', justifyContent: 'center', gap: 8, opacity: pressed ? 0.7 : 1 })}><N0Symbol name="camera.fill" size={29} /><N0Text variant="headline">Kamerayı Aç</N0Text><N0Text variant="caption">QR kodu kadraja getir</N0Text></Pressable>
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Sonuçlar analitiktir, tavsiye değildir.</N0Text>
  </Screen>;
}
