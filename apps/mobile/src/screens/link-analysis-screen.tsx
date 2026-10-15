import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { StandaloneTabBar } from '@/components/brand-tab-bar';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { hasTrustedIntakeSource, readInboundValue } from '@/domain/intake';
import { analyzeUrl, normalizeUrl, type LocalAssessment } from '@/domain/risk';
import { colors, fonts, radius, shadows } from '@/theme';

export default function LinkAnalysisScreen() {
  const params = useLocalSearchParams<{ value?: string | string[]; source?: string | string[] }>();
  const inboundValue = readInboundValue(params.value, 4096);
  const fromExtension = hasTrustedIntakeSource(params.source);
  const [value, setValue] = useState(inboundValue);
  const [normalized, setNormalized] = useState('');
  const [assessment, setAssessment] = useState<LocalAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submit = () => { try { const url = normalizeUrl(value).toString(); setNormalized(url); setAssessment(analyzeUrl(url)); setError(null); } catch (cause) { setAssessment(null); setError(cause instanceof Error ? cause.message : 'Bağlantı incelenemedi.'); } };
  const tone = assessment?.verdict === 'BLOCK' ? colors.danger : assessment?.verdict === 'WARN' ? colors.warning : colors.info;
  const parsed = assessment ? new URL(normalized) : null;
  const riskLabel = assessment?.verdict === 'BLOCK' ? 'Yüksek' : assessment?.verdict === 'WARN' ? 'Orta' : 'Doğrulanamadı';
  const rows = assessment && parsed ? [
    ['Alan adı', parsed.hostname],
    ['Protokol', parsed.protocol === 'https:' ? 'HTTPS' : 'HTTP'],
    ['Risk seviyesi', riskLabel],
    ['Yerel bulgu', `${assessment.evidence.length} işaret`],
    ['Canlı doğrulama', 'Bağlı değil'],
  ] : [];
  return <View style={{ flex: 1, backgroundColor: colors.background }}><Screen contentContainerStyle={{ gap: 18 }}>
    {fromExtension && inboundValue ? <Surface style={{ flexDirection: 'row', gap: 11, alignItems: 'center' }}><N0Symbol name="square.and.arrow.down.fill" size={22} /><View style={{ flex: 1, gap: 2 }}><N0Text variant="headline">Paylaşılan bağlantı hazır</N0Text><N0Text variant="caption">İçerik otomatik açılmadı. İncelemek için Analiz Et’e dokunun.</N0Text></View></Surface> : null}
    <Surface style={{ gap: 13, padding: 10 }}><View style={{ minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13 }}><N0Symbol name="link" size={23} /><TextInput value={value} onChangeText={(next) => { setValue(next); setAssessment(null); setError(null); }} onSubmitEditing={submit} autoCapitalize="none" autoCorrect={false} keyboardType="url" returnKeyType="go" placeholder="https://ornek.com/giris" placeholderTextColor={colors.textMuted} accessibilityLabel="İncelenecek bağlantı" style={{ flex: 1, color: colors.text, fontFamily: fonts.regular, fontSize: 13 }} />{value ? <Pressable onPress={() => { setValue(''); setAssessment(null); setError(null); }} hitSlop={10} accessibilityLabel="Bağlantıyı temizle"><N0Symbol name="xmark" size={16} tintColor={colors.text} /></Pressable> : null}</View>{error ? <N0Text variant="small" style={{ color: colors.danger }}>{error}</N0Text> : null}<ActionButton title="Analiz Et" onPress={submit} disabled={!value.trim()} /></Surface>
    {assessment ? <View style={{ gap: 9 }}><N0Text variant="title" style={{ fontSize: 21 }}>Analiz Sonucu</N0Text><Surface style={{ padding: 0, overflow: 'hidden', boxShadow: assessment.verdict === 'BLOCK' ? shadows.dangerGlow : shadows.card }}><View style={{ minHeight: 91, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: assessment.verdict === 'BLOCK' ? colors.dangerMuted : assessment.verdict === 'WARN' ? colors.warningMuted : colors.surfaceRaised, borderBottomWidth: 1, borderBottomColor: tone }}><N0Symbol name={assessment.verdict === 'BLOCK' ? 'exclamationmark.triangle.fill' : 'exclamationmark.circle.fill'} size={46} tintColor={tone} /><View style={{ flex: 1, gap: 4 }}><N0Text variant="title" style={{ color: tone, fontSize: 20 }}>{assessment.verdict === 'BLOCK' ? 'Yüksek Risk' : assessment.verdict === 'WARN' ? 'Orta Risk' : 'Doğrulanamadı'}</N0Text><N0Text variant="small" style={{ color: colors.text }}>Bu bağlantıyı açmadan önce bağımsız doğrulama yapın.</N0Text></View></View>{rows.map(([label, detail], index) => <View key={label} style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.separator }}><N0Text variant="small" style={{ width: '43%' }}>{label}</N0Text><N0Text variant="small" numberOfLines={2} style={{ flex: 1, color: label === 'Risk seviyesi' ? tone : colors.text, fontFamily: label === 'Risk seviyesi' ? fonts.semibold : fonts.regular }}>{detail}</N0Text></View>)}<Pressable onPress={() => router.push({ pathname: '/risk-result', params: { kind: 'URL', value: normalized } })} style={({ pressed }) => ({ minHeight: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, opacity: pressed ? 0.65 : 1 })}><N0Text variant="headline" style={{ color: colors.brand, fontSize: 14 }}>Detayları Gör</N0Text><N0Symbol name="chevron.right" size={15} tintColor={colors.text} /></Pressable></Surface></View> : <Surface style={{ flexDirection: 'row', gap: 11, alignItems: 'center' }}><N0Symbol name="lock.shield.fill" size={23} /><View style={{ flex: 1 }}><N0Text variant="headline">Bağlantı otomatik açılmaz</N0Text><N0Text variant="caption">Analiz cihaz üzerindeki mevcut kurallarla yapılır.</N0Text></View></Surface>}
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Sonuç analitiktir, tavsiye değildir.</N0Text>
  </Screen><StandaloneTabBar active="scan" /></View>;
}
