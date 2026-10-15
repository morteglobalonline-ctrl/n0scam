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
import { analyzeMessage, type LocalAssessment } from '@/domain/risk';
import { colors, fonts, radius, shadows } from '@/theme';

const modes = ['Metin', 'Ekran Görüntüsü', 'Dosya'] as const;

export default function MessageAnalysisScreen() {
  const params = useLocalSearchParams<{ value?: string | string[]; source?: string | string[] }>();
  const inboundValue = readInboundValue(params.value, 5000);
  const fromExtension = hasTrustedIntakeSource(params.source);
  const [mode, setMode] = useState<(typeof modes)[number]>('Metin');
  const [value, setValue] = useState(inboundValue);
  const [assessment, setAssessment] = useState<LocalAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submit = () => { try { setAssessment(analyzeMessage(value)); setError(null); } catch (cause) { setAssessment(null); setError(cause instanceof Error ? cause.message : 'Mesaj incelenemedi.'); } };
  const tone = assessment?.verdict === 'BLOCK' ? colors.danger : assessment?.verdict === 'WARN' ? colors.warning : colors.info;
  return <View style={{ flex: 1, backgroundColor: colors.background }}><Screen contentContainerStyle={{ gap: 15 }}>
    {fromExtension && inboundValue ? <Surface style={{ flexDirection: 'row', gap: 11, alignItems: 'center' }}><N0Symbol name="square.and.arrow.down.fill" size={22} /><View style={{ flex: 1, gap: 2 }}><N0Text variant="headline">Paylaşılan içerik hazır</N0Text><N0Text variant="caption">İçerik gönderilmedi veya çalıştırılmadı. Analizi siz başlatın.</N0Text></View></Surface> : null}
    <View style={{ flexDirection: 'row', gap: 7, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 7 }}>{modes.map((label) => <Pressable key={label} onPress={() => { setMode(label); setAssessment(null); setError(null); }} accessibilityRole="tab" accessibilityState={{ selected: mode === label }} style={({ pressed }) => ({ flex: 1, minHeight: 45, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1, borderColor: mode === label ? colors.brand : colors.separator, backgroundColor: mode === label ? colors.brandWash : colors.backgroundElevated, opacity: pressed ? 0.6 : 1 })}><N0Text variant="small" style={{ color: mode === label ? colors.brand : colors.textSecondary, fontFamily: mode === label ? fonts.semibold : fonts.regular, textAlign: 'center' }}>{label}</N0Text></Pressable>)}</View>
    {mode === 'Metin' ? <><View style={{ gap: 9 }}><View><TextInput value={value} onChangeText={(next) => { setValue(next); setAssessment(null); setError(null); }} multiline textAlignVertical="top" maxLength={5000} placeholder="Şüpheli mesaj veya e-posta metnini buraya yapıştırın…" placeholderTextColor={colors.textMuted} accessibilityLabel="İncelenecek mesaj" style={{ minHeight: 245, color: colors.text, backgroundColor: colors.surface, borderColor: error ? colors.danger : colors.border, borderWidth: 1, borderRadius: radius.lg, borderCurve: 'continuous', padding: 17, paddingBottom: 34, fontFamily: fonts.regular, fontSize: 14, lineHeight: 23 }} /><N0Text variant="small" style={{ position: 'absolute', right: 14, bottom: 10, fontVariant: ['tabular-nums'] }}>{value.length}/5000</N0Text></View>{error ? <N0Text variant="small" style={{ color: colors.danger }}>{error}</N0Text> : null}<ActionButton title="Analiz Et" onPress={submit} disabled={!value.trim()} /></View>
      {assessment ? <View style={{ gap: 9, borderTopWidth: 1, borderTopColor: colors.separator, paddingTop: 14 }}><N0Text variant="title" style={{ fontSize: 21 }}>Sonuç</N0Text><Surface style={{ minHeight: 110, flexDirection: 'row', alignItems: 'center', gap: 15, padding: 17, backgroundColor: assessment.verdict === 'BLOCK' ? colors.dangerMuted : assessment.verdict === 'WARN' ? colors.warningMuted : colors.surfaceRaised, borderColor: tone, boxShadow: assessment.verdict === 'BLOCK' ? shadows.dangerGlow : shadows.card }}><N0Symbol name="exclamationmark.triangle.fill" size={45} tintColor={tone} /><View style={{ flex: 1, gap: 5 }}><N0Text variant="title" style={{ color: tone, fontSize: 19 }}>{assessment.verdict === 'BLOCK' ? 'Dolandırıcılık Riski' : assessment.verdict === 'WARN' ? 'Şüpheli İçerik' : 'Doğrulanamadı'}</N0Text><N0Text variant="small" style={{ color: colors.text }}>Bu mesajda {assessment.evidence.length} analitik işaret bulundu.</N0Text><Pressable onPress={() => router.push({ pathname: '/risk-result', params: { kind: 'MESSAGE', value } })}><N0Text variant="small" style={{ color: colors.brand }}>Detayları Gör</N0Text></Pressable></View></Surface></View> : null}</> : <Surface style={{ minHeight: 330, alignItems: 'center', justifyContent: 'center', gap: 12 }}><N0Symbol name={mode === 'Ekran Görüntüsü' ? 'photo.fill' : 'doc.fill'} size={38} /><N0Text variant="heading">{mode} analizi hazırlanıyor</N0Text><N0Text variant="small" style={{ textAlign: 'center', maxWidth: 285 }}>Bu giriş türü mevcut analiz motoruna henüz bağlı değil. Metin sekmesindeki çalışan akış korunmuştur.</N0Text></Surface>}
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Sonuç analitiktir, tavsiye değildir.</N0Text>
  </Screen><StandaloneTabBar active="scan" /></View>;
}
