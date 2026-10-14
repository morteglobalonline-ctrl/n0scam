import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { colors, spacing } from '@/theme';

const rows = [
  { title: 'Gizlilik ve veri', detail: 'Veri minimizasyonu ve saklama', icon: 'hand.raised.fill' as const, route: '/privacy' as const },
  { title: 'Bağlı hesaplar', detail: 'Henüz bağlantı yok', icon: 'person.crop.circle.badge.plus' as const, route: '/protection' as const },
  { title: 'İzinler', detail: 'Kamera izni kullanım sırasında istenir', icon: 'checkmark.shield.fill' as const, route: '/protection' as const },
];

export default function SettingsScreen() {
  return <Screen><View style={{ paddingTop: spacing.xl, gap: spacing.sm }}><N0Text variant="title">Ayarlar</N0Text><N0Text variant="small">n0scam • iOS erken geliştirme sürümü</N0Text></View><Surface style={{ padding: 0 }}>{rows.map((row, index) => <Pressable key={row.title} onPress={() => router.push(row.route)} style={({ pressed }) => ({ padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderBottomWidth: index < rows.length - 1 ? 1 : 0, borderBottomColor: colors.separator, opacity: pressed ? 0.65 : 1 })}><N0Symbol name={row.icon} /><View style={{ flex: 1 }}><N0Text variant="headline">{row.title}</N0Text><N0Text variant="caption">{row.detail}</N0Text></View><N0Symbol name="chevron.right" size={15} tintColor={colors.textMuted} /></Pressable>)}</Surface><View style={{ gap: spacing.sm }}><N0Text variant="caption">Hesap ve abonelik</N0Text><Surface><N0Text variant="headline">Ücretsiz geliştirme sürümü</N0Text><N0Text variant="small">Apple IAP ve canlı Pro özellikleri bu kilometre taşında bağlı değil.</N0Text></Surface></View></Screen>;
}
