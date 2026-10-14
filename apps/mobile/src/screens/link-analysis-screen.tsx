import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { analyzeUrl, normalizeUrl, type LocalAssessment } from '@/domain/risk';
import { colors, fonts, radius, spacing } from '@/theme';

export default function LinkAnalysisScreen() {
  const [value, setValue] = useState('');
  const [normalized, setNormalized] = useState('');
  const [assessment, setAssessment] = useState<LocalAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submit = () => { try { const url = normalizeUrl(value).toString(); setNormalized(url); setAssessment(analyzeUrl(url)); setError(null); } catch (cause) { setAssessment(null); setError(cause instanceof Error ? cause.message : 'Bağlantı incelenemedi.'); } };
  const tone = assessment?.verdict === 'BLOCK' ? colors.danger : assessment?.verdict === 'WARN' ? colors.warning : colors.info;
  return <Screen>
    <View style={{ gap: 3 }}><N0Text variant="heading">Şüpheli bağlantıyı yapıştır</N0Text><N0Text variant="small">Bağlantı açılmadan cihaz üzerinde ön değerlendirilir.</N0Text></View>
    <View style={{ gap: 9 }}><TextInput value={value} onChangeText={(next) => { setValue(next); setAssessment(null); setError(null); }} onSubmitEditing={submit} autoCapitalize="none" autoCorrect={false} keyboardType="url" returnKeyType="go" placeholder="https://ornek.com/giris" placeholderTextColor={colors.textMuted} accessibilityLabel="İncelenecek bağlantı" style={{ minHeight: 45, color: colors.text, backgroundColor: colors.surface, borderColor: error ? colors.danger : colors.separator, borderWidth: 1, borderRadius: radius.md, borderCurve: 'continuous', paddingHorizontal: spacing.md, fontFamily: fonts.regular, fontSize: 12 }} />{error ? <N0Text variant="caption" style={{ color: colors.danger }}>{error}</N0Text> : null}<ActionButton title="Analiz Et" onPress={submit} disabled={!value.trim()} /></View>
    {assessment ? <>
      <Surface style={{ gap: 10, borderColor: `${tone}88`, backgroundColor: assessment.verdict === 'BLOCK' ? colors.dangerMuted : assessment.verdict === 'WARN' ? colors.warningMuted : colors.surface }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><View style={{ width: 37, height: 37, borderRadius: radius.full, borderWidth: 1, borderColor: tone, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={assessment.verdict === 'BLOCK' ? 'exclamationmark.triangle.fill' : 'exclamationmark.circle.fill'} size={19} tintColor={tone} /></View><View style={{ flex: 1 }}><N0Text variant="headline" style={{ color: tone }}>{assessment.verdict === 'BLOCK' ? 'Dolandırıcılık riski' : assessment.verdict === 'WARN' ? 'Dikkat gerekiyor' : 'Canlı olarak doğrulanamadı'}</N0Text><N0Text variant="caption">{assessment.evidence.length} analitik işaret bulundu</N0Text></View></View>
        <N0Text variant="caption" numberOfLines={2}>{normalized}</N0Text>
        <ActionButton title="Detayları Gör" onPress={() => router.push({ pathname: '/risk-result', params: { kind: 'URL', value: normalized } })} />
      </Surface>
      <View style={{ gap: 7 }}><N0Text variant="caption">İLK BULGULAR</N0Text><Surface style={{ padding: 0 }}>{assessment.evidence.slice(0, 3).map((item, index, list) => <View key={item.title} style={{ minHeight: 48, padding: 10, flexDirection: 'row', gap: 9, borderBottomWidth: index === list.length - 1 ? 0 : 1, borderBottomColor: colors.separator }}><N0Symbol name="exclamationmark.circle.fill" size={15} tintColor={tone} /><View style={{ flex: 1 }}><N0Text variant="headline">{item.title}</N0Text><N0Text variant="caption">{item.detail}</N0Text></View></View>)}</Surface></View>
    </> : <Surface style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><N0Symbol name="lock.shield.fill" size={20} /><View style={{ flex: 1 }}><N0Text variant="headline">Önce kontrol, sonra karar</N0Text><N0Text variant="caption">Hiçbir bağlantı analiz sırasında otomatik açılmaz.</N0Text></View></Surface>}
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Sonuç analitiktir, tavsiye değildir. Canlı tehdit verisi henüz bağlı değildir.</N0Text>
  </Screen>;
}
