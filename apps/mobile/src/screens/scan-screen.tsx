import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { colors, radius, spacing } from '@/theme';

const scanModes = [
  { title: 'QR kod', detail: 'Kamerayla tara; hedef otomatik açılmaz.', icon: 'qrcode.viewfinder' as const, route: '/qr-scanner' as const },
  { title: 'Bağlantı', detail: 'URL yapıştır ve yerel risk işaretlerini incele.', icon: 'link' as const, route: '/link-analysis' as const },
  { title: 'Mesaj', detail: 'Metindeki baskı, bilgi ve ödeme taleplerini kontrol et.', icon: 'text.bubble.fill' as const, route: '/message-analysis' as const },
];

export default function ScanScreen() {
  return <Screen><View style={{ paddingTop: spacing.xl, gap: spacing.sm }}><N0Text variant="title">Neyi kontrol edelim?</N0Text><N0Text variant="body" style={{ color: colors.textSecondary }}>İçerik yalnızca seçtiğin analiz akışına gönderilir. Bu sürümde URL ve mesaj ön değerlendirmesi cihaz üzerinde çalışır.</N0Text></View><View style={{ gap: spacing.md }}>{scanModes.map((mode) => <Pressable key={mode.title} onPress={() => router.push(mode.route)} accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? 0.68 : 1 })}><Surface style={{ minHeight: 112, flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}><View style={{ width: 50, height: 50, borderRadius: radius.md, backgroundColor: colors.brandMuted, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={mode.icon} size={25} /></View><View style={{ flex: 1, gap: spacing.xs }}><N0Text variant="heading">{mode.title}</N0Text><N0Text variant="small">{mode.detail}</N0Text></View><N0Symbol name="chevron.right" tintColor={colors.textMuted} size={16} /></Surface></Pressable>)}</View><N0Text variant="caption">Sonuçlar analitiktir, tavsiye değildir. Belirsiz durumlarda kurumun resmi kanalından bağımsız doğrulama yap.</N0Text></Screen>;
}
