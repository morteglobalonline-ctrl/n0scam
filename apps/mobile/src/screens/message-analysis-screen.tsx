import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { analyzeMessage, type LocalAssessment } from '@/domain/risk';
import { colors, fonts, radius, spacing } from '@/theme';

export default function MessageAnalysisScreen() {
  const [value, setValue] = useState('');
  const [assessment, setAssessment] = useState<LocalAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submit = () => { try { setAssessment(analyzeMessage(value)); setError(null); } catch (cause) { setAssessment(null); setError(cause instanceof Error ? cause.message : 'Mesaj incelenemedi.'); } };
  const tone = assessment?.verdict === 'BLOCK' ? colors.danger : assessment?.verdict === 'WARN' ? colors.warning : colors.info;
  return <Screen>
    <View style={{ gap: 3 }}><N0Text variant="heading">Mesaj veya e-postayı kontrol et</N0Text><N0Text variant="small">Aciliyet, hassas bilgi ve ödeme baskısı işaretlerini ara.</N0Text></View>
    <View style={{ flexDirection: 'row', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.separator, borderRadius: radius.md, padding: 3 }}>{['Metin', 'Ekran Görüntüsü', 'Dosya'].map((label, index) => <Pressable key={label} disabled={index > 0} style={{ flex: 1, minHeight: 29, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: index === 0 ? colors.brandMuted : 'transparent', opacity: index > 0 ? 0.38 : 1 }}><N0Text variant="caption" style={{ color: index === 0 ? colors.brand : colors.textSecondary }}>{label}{index > 0 ? ' •' : ''}</N0Text></Pressable>)}</View>
    <View style={{ gap: 8 }}><TextInput value={value} onChangeText={(next) => { setValue(next); setAssessment(null); setError(null); }} multiline textAlignVertical="top" maxLength={5000} placeholder="Şüpheli mesajı buraya yapıştır…" placeholderTextColor={colors.textMuted} accessibilityLabel="İncelenecek mesaj" style={{ minHeight: 154, color: colors.text, backgroundColor: colors.surface, borderColor: error ? colors.danger : colors.separator, borderWidth: 1, borderRadius: radius.md, borderCurve: 'continuous', padding: spacing.md, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18 }} /><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>{error ? <N0Text variant="caption" style={{ color: colors.danger, flex: 1 }}>{error}</N0Text> : <N0Text variant="caption">• İşaretli seçenekler yakında</N0Text>}<N0Text variant="caption" style={{ fontVariant: ['tabular-nums'] }}>{value.length} / 5000</N0Text></View><ActionButton title="Analiz Et" onPress={submit} disabled={!value.trim()} /></View>
    {assessment ? <Surface style={{ gap: 10, borderColor: `${tone}88`, backgroundColor: assessment.verdict === 'BLOCK' ? colors.dangerMuted : assessment.verdict === 'WARN' ? colors.warningMuted : colors.surface }}><View style={{ flexDirection: 'row', gap: 9, alignItems: 'center' }}><N0Symbol name="exclamationmark.triangle.fill" size={22} tintColor={tone} /><View style={{ flex: 1 }}><N0Text variant="headline" style={{ color: tone }}>{assessment.verdict === 'BLOCK' ? 'Yüksek risk işaretleri' : assessment.verdict === 'WARN' ? 'Şüpheli dil işaretleri' : 'Canlı olarak doğrulanamadı'}</N0Text><N0Text variant="caption">{assessment.evidence.length} analitik bulgu</N0Text></View></View><ActionButton title="Detayları Gör" onPress={() => router.push({ pathname: '/risk-result', params: { kind: 'MESSAGE', value } })} /></Surface> : null}
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Mesaj analizi cihaz üzerindeki sınırlı kurallara dayanır. Analitiktir, tavsiye değildir.</N0Text>
  </Screen>;
}
