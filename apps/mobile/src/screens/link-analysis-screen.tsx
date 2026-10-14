import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { normalizeUrl } from '@/domain/risk';
import { colors, fonts, radius, spacing } from '@/theme';

export default function LinkAnalysisScreen() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const submit = () => { try { const normalized = normalizeUrl(value); setError(null); router.push({ pathname: '/risk-result', params: { kind: 'URL', value: normalized.toString() } }); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Bağlantı incelenemedi.'); } };
  return <Screen><View style={{ gap: spacing.sm }}><N0Text variant="heading">Bağlantıyı açmadan kontrol et</N0Text><N0Text variant="small">Alan adı ve URL yapısı cihaz üzerinde ön değerlendirmeden geçer.</N0Text></View><Surface style={{ gap: spacing.md }}><TextInput value={value} onChangeText={setValue} onSubmitEditing={submit} autoCapitalize="none" autoCorrect={false} keyboardType="url" returnKeyType="go" placeholder="ornek.com/giris" placeholderTextColor={colors.textMuted} accessibilityLabel="İncelenecek bağlantı" style={{ minHeight: 54, color: colors.text, backgroundColor: colors.backgroundElevated, borderColor: error ? colors.danger : colors.separator, borderWidth: 1, borderRadius: radius.md, borderCurve: 'continuous', paddingHorizontal: spacing.lg, fontFamily: fonts.regular, fontSize: 15 }} />{error ? <N0Text variant="small" style={{ color: colors.danger }}>{error}</N0Text> : null}<ActionButton title="Analiz Et" onPress={submit} disabled={!value.trim()} /></Surface><Surface style={{ gap: spacing.sm }}><N0Text variant="headline">Bu sürüm neyi kontrol ediyor?</N0Text><N0Text variant="small">HTTPS kullanımı, kodlanmış alan adı, IP adresi, aldatıcı kullanıcı bilgisi, karmaşık alan adı ve bazı marka taklidi işaretleri.</N0Text><N0Text variant="caption" style={{ color: colors.warning }}>Canlı tehdit verisi henüz bağlı değildir. Sonuç analitiktir, tavsiye değildir.</N0Text></Surface></Screen>;
}
