import { View } from 'react-native';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { colors, radius, spacing } from '@/theme';

export default function HistoryScreen() {
  return <Screen contentContainerStyle={{ flexGrow: 1 }}><View style={{ paddingTop: spacing.xl, gap: spacing.sm }}><N0Text variant="title">Geçmiş</N0Text><N0Text variant="body" style={{ color: colors.textSecondary }}>İncelemelerin, saklamayı seçtiğinde burada görünür.</N0Text></View><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingBottom: 80 }}><View style={{ width: 72, height: 72, borderRadius: radius.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="clock.arrow.circlepath" size={32} tintColor={colors.textMuted} /></View><View style={{ alignItems: 'center', gap: spacing.sm }}><N0Text variant="heading">Henüz kayıt yok</N0Text><N0Text variant="small" style={{ textAlign: 'center', maxWidth: 290 }}>Sahte olay göstermiyoruz. Kalıcı geçmiş, açık saklama tercihiyle eklenecek.</N0Text></View></View></Screen>;
}
