import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { analyzeMessage } from '@/domain/risk';
import { colors, fonts, radius, spacing } from '@/theme';

export default function MessageAnalysisScreen() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const submit = () => { try { analyzeMessage(value); setError(null); router.push({ pathname: '/risk-result', params: { kind: 'MESSAGE', value } }); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Mesaj incelenemedi.'); } };
  return <Screen><View style={{ gap: spacing.sm }}><N0Text variant="heading">Mesaj metnini yapıştır</N0Text><N0Text variant="small">n0scam aciliyet, hassas bilgi ve ödeme baskısı gibi dil işaretlerini ön değerlendirmeden geçirir.</N0Text></View><Surface style={{ gap: spacing.md }}><TextInput value={value} onChangeText={setValue} multiline textAlignVertical="top" maxLength={5000} placeholder="Şüpheli mesajı buraya yapıştır…" placeholderTextColor={colors.textMuted} accessibilityLabel="İncelenecek mesaj" style={{ minHeight: 210, color: colors.text, backgroundColor: colors.backgroundElevated, borderColor: error ? colors.danger : colors.separator, borderWidth: 1, borderRadius: radius.md, borderCurve: 'continuous', padding: spacing.lg, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 }} /><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>{error ? <N0Text variant="caption" style={{ color: colors.danger, flex: 1 }}>{error}</N0Text> : <View />}<N0Text variant="caption" style={{ fontVariant: ['tabular-nums'] }}>{value.length} / 5000</N0Text></View><ActionButton title="Mesajı Analiz Et" onPress={submit} disabled={!value.trim()} /></Surface><N0Text variant="caption">Mesaj analizi cihaz üzerinde çalışan sınırlı kurallara dayanır. Analitiktir, tavsiye değildir.</N0Text></Screen>;
}
