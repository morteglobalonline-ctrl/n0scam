import { useLocalSearchParams, router } from 'expo-router';
import { View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { StatusPill } from '@/components/status-pill';
import { Surface } from '@/components/surface';
import { analyzeMessage, analyzeUrl, type LocalAssessment } from '@/domain/risk';
import { colors, radius, spacing } from '@/theme';

function createAssessment(kind: string, value: string): LocalAssessment {
  if (kind === 'MESSAGE') return analyzeMessage(value);
  try { return analyzeUrl(value, kind === 'QR' ? 'QR' : 'URL'); } catch { return { inputType: 'QR', displayValue: value, verdict: 'UNKNOWN', severity: 'LOW', evidence: [{ title: 'URL olmayan QR içeriği', detail: 'İçerik otomatik çalıştırılmadı veya başka bir uygulamaya aktarılmadı.' }], missingData: ['İçerik türüne özel doğrulama'], actions: ['İçeriği çalıştırmadan önce kaynağını doğrula', 'Ödeme veya Wi-Fi bilgilerini bağımsız kontrol et'] }; }
}

export default function RiskResultScreen() {
  const params = useLocalSearchParams<{ kind?: string; value?: string }>();
  const assessment = createAssessment(params.kind ?? 'URL', params.value ?? '');
  const palette = assessment.verdict === 'BLOCK' ? { color: colors.danger, bg: colors.dangerMuted, icon: 'exclamationmark.triangle.fill' as const, title: 'Yüksek risk işaretleri' } : assessment.verdict === 'WARN' ? { color: colors.warning, bg: colors.warningMuted, icon: 'exclamationmark.circle.fill' as const, title: 'Dikkat gerekiyor' } : { color: colors.info, bg: colors.surfaceRaised, icon: 'questionmark.circle.fill' as const, title: 'Doğrulanamadı' };
  return <Screen><Surface style={{ backgroundColor: palette.bg, borderColor: palette.color, alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl }}><View style={{ width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={palette.icon} size={32} tintColor={palette.color} /></View><N0Text variant="heading" style={{ color: palette.color, textAlign: 'center' }}>{palette.title}</N0Text><StatusPill tone="neutral" label="Yerel ön değerlendirme" /><N0Text variant="small" style={{ textAlign: 'center' }}>Canlı tehdit istihbaratı bağlı değildir. Analitiktir, tavsiye değildir.</N0Text></Surface><Surface style={{ gap: spacing.sm }}><N0Text variant="caption">İNCELENEN İÇERİK</N0Text><N0Text variant="body" style={{ color: colors.textSecondary }}>{assessment.displayValue}</N0Text></Surface><View style={{ gap: spacing.md }}><N0Text variant="heading">Tespit edilen işaretler</N0Text>{assessment.evidence.map((item) => <Surface key={item.title} style={{ flexDirection: 'row', gap: spacing.md }}><N0Symbol name="checkmark.circle.fill" tintColor={palette.color} size={20} /><View style={{ flex: 1, gap: spacing.xs }}><N0Text variant="headline">{item.title}</N0Text><N0Text variant="small">{item.detail}</N0Text></View></Surface>)}</View><View style={{ gap: spacing.md }}><N0Text variant="heading">Eksik veriler</N0Text><N0Text variant="small">{assessment.missingData.join(' • ')}</N0Text></View><View style={{ gap: spacing.md }}><N0Text variant="heading">Güvenli sonraki adımlar</N0Text>{assessment.actions.map((action) => <View key={action} style={{ flexDirection: 'row', gap: spacing.md }}><N0Symbol name="arrow.right.circle.fill" size={18} /><N0Text variant="body" style={{ flex: 1 }}>{action}</N0Text></View>)}</View><ActionButton title="Yeni Analiz" onPress={() => router.replace('/scan')} /><ActionButton title="Geri Dön" variant="secondary" onPress={() => router.back()} /></Screen>;
}
