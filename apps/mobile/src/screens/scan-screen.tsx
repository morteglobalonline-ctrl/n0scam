import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { colors, radius, spacing } from '@/theme';

const scanModes = [
  { title: 'QR Kod Tara', detail: 'Kameradan veya fotoğraftan', icon: 'qrcode.viewfinder' as const, route: '/qr-scanner' as const },
  { title: 'Link Analiz Et', detail: 'URL yapısını kontrol et', icon: 'link' as const, route: '/link-analysis' as const },
  { title: 'Mesaj / E-posta', detail: 'Şüpheli metni incele', icon: 'doc.text.fill' as const, route: '/message-analysis' as const },
  { title: 'Fotoğraf Analiz Et', detail: 'Görseldeki QR kodunu seç', icon: 'photo.fill' as const, route: '/qr-scanner' as const },
];

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  return <Screen contentContainerStyle={{ paddingTop: insets.top + 12, gap: spacing.lg }}>
    <View style={{ gap: 4 }}><N0Text variant="title" style={{ fontSize: 27 }}>Tarama</N0Text><N0Text variant="small">Kontrol türünü seçin. İçerik izniniz olmadan açılmaz.</N0Text></View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>{scanModes.map((mode) => <Pressable key={mode.title} onPress={() => router.push(mode.route)} style={({ pressed }) => ({ width: '48.6%', minHeight: 132, backgroundColor: colors.surface, borderWidth: 1, borderColor: pressed ? colors.brand : colors.border, borderRadius: radius.lg, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center', padding: 13, gap: 9, opacity: pressed ? 0.65 : 1 })}><N0Symbol name={mode.icon} size={34} /><N0Text variant="headline" style={{ textAlign: 'center', fontSize: 13 }}>{mode.title}</N0Text><N0Text variant="caption" style={{ textAlign: 'center' }}>{mode.detail}</N0Text></Pressable>)}</View>
    <Pressable onPress={() => router.push('/qr-scanner')} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}><Surface style={{ minHeight: 170, alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.brandWash }}><View style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="camera.fill" size={30} /></View><N0Text variant="heading">Kamerayla Hızlı Tara</N0Text><N0Text variant="small">QR kodunu açmadan analiz edin.</N0Text></Surface></Pressable>
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Sonuçlar analitiktir, tavsiye değildir.</N0Text>
  </Screen>;
}
