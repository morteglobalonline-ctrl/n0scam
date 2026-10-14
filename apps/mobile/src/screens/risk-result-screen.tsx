import * as WebBrowser from 'expo-web-browser';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { analyzeMessage, analyzeUrl, type LocalAssessment } from '@/domain/risk';
import { colors, radius } from '@/theme';

function createAssessment(kind: string, value: string): LocalAssessment {
  if (kind === 'MESSAGE') return analyzeMessage(value);
  try { return analyzeUrl(value, kind === 'QR' ? 'QR' : 'URL'); } catch { return { inputType: 'QR', displayValue: value, verdict: 'UNKNOWN', severity: 'LOW', evidence: [{ title: 'URL olmayan QR içeriği', detail: 'İçerik otomatik çalıştırılmadı veya başka bir uygulamaya aktarılmadı.' }], missingData: ['İçerik türüne özel doğrulama'], actions: ['İçeriği çalıştırmadan önce kaynağını doğrula', 'Ödeme veya Wi-Fi bilgilerini bağımsız kontrol et'] }; }
}

export default function RiskResultScreen() {
  const params = useLocalSearchParams<{ kind?: string; value?: string }>();
  const kind = params.kind ?? 'URL';
  const value = params.value ?? '';
  const assessment = createAssessment(kind, value);
  const palette = assessment.verdict === 'BLOCK' ? { color: colors.danger, bg: colors.dangerMuted, icon: 'exclamationmark.triangle.fill' as const, title: 'Dolandırıcılık Riski', label: 'YÜKSEK RİSK' } : assessment.verdict === 'WARN' ? { color: colors.warning, bg: colors.warningMuted, icon: 'exclamationmark.circle.fill' as const, title: 'Dikkat Gerekiyor', label: 'ŞÜPHELİ' } : { color: colors.info, bg: colors.surfaceRaised, icon: 'questionmark.circle.fill' as const, title: 'Doğrulanamadı', label: 'BELİRSİZ' };
  const openAnyway = () => Alert.alert('Bağlantıyı açmak istiyor musun?', 'n0scam bu bağlantının güvenli olduğunu doğrulamadı. Açarsan tarayıcıya aktarılacak.', [{ text: 'Vazgeç', style: 'cancel' }, { text: 'Yine de Aç', style: 'destructive', onPress: () => { void WebBrowser.openBrowserAsync(value); } }]);
  return <Screen>
    <Surface style={{ minHeight: 203, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: palette.bg, borderColor: palette.color }}>
      <View style={{ position: 'absolute', width: 240, height: 240, borderRadius: radius.full, backgroundColor: `${palette.color}0B` }} />
      <View style={{ width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.background, borderWidth: 1, borderColor: palette.color, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={palette.icon} size={30} tintColor={palette.color} /></View>
      <N0Text variant="heading" style={{ color: palette.color }}>{palette.title}</N0Text>
      <View style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full, backgroundColor: `${palette.color}1C`, borderWidth: 1, borderColor: `${palette.color}66` }}><N0Text variant="caption" style={{ color: palette.color }}>{palette.label} • YEREL ANALİZ</N0Text></View>
      <N0Text variant="caption" style={{ textAlign: 'center', maxWidth: 275 }}>Canlı tehdit istihbaratı bağlı değil. Sonuç analitiktir, tavsiye değildir.</N0Text>
    </Surface>
    <Surface style={{ padding: 0 }}>{assessment.evidence.map((item, index) => <View key={item.title} style={{ minHeight: 58, flexDirection: 'row', gap: 10, padding: 11, borderBottomWidth: index === assessment.evidence.length - 1 ? 0 : 1, borderBottomColor: colors.separator }}><View style={{ width: 25, height: 25, borderRadius: radius.full, backgroundColor: `${palette.color}1A`, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="exclamationmark" size={13} tintColor={palette.color} /></View><View style={{ flex: 1, gap: 2 }}><N0Text variant="headline">{item.title}</N0Text><N0Text variant="caption">{item.detail}</N0Text></View></View>)}</Surface>
    <View style={{ gap: 8 }}><N0Text variant="caption">GÜVENLİ SONRAKİ ADIMLAR</N0Text>{assessment.actions.map((action) => <View key={action} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><N0Symbol name="checkmark.circle.fill" size={15} /><N0Text variant="small" style={{ flex: 1, color: colors.text }}>{action}</N0Text></View>)}</View>
    <ActionButton title="Güvenli Seçenekleri Gör" onPress={() => router.replace('/scan')} />
    {kind !== 'MESSAGE' && /^https?:\/\//i.test(value) ? <ActionButton title="Yine de Aç" variant="danger" onPress={openAnyway} /> : <ActionButton title="Geri Dön" variant="secondary" onPress={() => router.back()} />}
  </Screen>;
}
