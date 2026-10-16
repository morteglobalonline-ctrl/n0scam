import * as WebBrowser from 'expo-web-browser';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { Screen } from '@/components/screen';
import { Surface } from '@/components/surface';
import { historyKindForResult } from '@/domain/history';
import { analyzeMessage, analyzeUrl, type LocalAssessment } from '@/domain/risk';
import { saveHistoryRecord } from '@/services/history-store';
import { colors, radius, shadows } from '@/theme';

function createAssessment(kind: string, value: string): LocalAssessment {
  if (kind === 'MESSAGE') return analyzeMessage(value);
  try { return analyzeUrl(value, kind === 'QR' ? 'QR' : 'URL'); } catch { return { inputType: 'QR', displayValue: value, verdict: 'UNKNOWN', severity: 'LOW', evidence: [{ title: 'URL olmayan QR içeriği', detail: 'İçerik otomatik çalıştırılmadı veya başka bir uygulamaya aktarılmadı.' }], missingData: ['İçerik türüne özel doğrulama'], actions: ['İçeriği çalıştırmadan önce kaynağını doğrulayın', 'Ödeme veya Wi-Fi bilgilerini bağımsız kontrol edin'] }; }
}

function iconForEvidence(title: string) {
  const value = title.toLocaleLowerCase('tr-TR');
  if (value.includes('marka')) return 'building.columns.fill' as const;
  if (value.includes('bilgi') || value.includes('kimlik')) return 'person.text.rectangle.fill' as const;
  if (value.includes('bağlantı') || value.includes('alan adı')) return 'link' as const;
  if (value.includes('ödeme')) return 'creditcard.fill' as const;
  return 'exclamationmark' as const;
}

export default function RiskResultScreen() {
  const db = useSQLiteContext();
  const params = useLocalSearchParams<{ kind?: string; value?: string }>();
  const [showActions, setShowActions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const kind = params.kind ?? 'URL';
  const value = params.value ?? '';
  const assessment = createAssessment(kind, value);
  const palette = assessment.verdict === 'BLOCK' ? { color: colors.danger, bg: colors.dangerMuted, icon: 'exclamationmark.triangle.fill' as const, title: 'Dolandırıcılık Riski', label: 'Yüksek Risk' } : assessment.verdict === 'WARN' ? { color: colors.warning, bg: colors.warningMuted, icon: 'exclamationmark.circle.fill' as const, title: 'Dikkat Gerekiyor', label: 'Orta Risk' } : { color: colors.info, bg: colors.surfaceRaised, icon: 'questionmark.circle.fill' as const, title: 'Doğrulanamadı', label: 'Belirsiz' };
  const openAnyway = () => Alert.alert('Bağlantıyı açmak istiyor musunuz?', 'n0scam bu bağlantının güvenli olduğunu doğrulamadı. Açarsanız tarayıcıya aktarılacak.', [{ text: 'Vazgeç', style: 'cancel' }, { text: 'Yine de Aç', style: 'destructive', onPress: () => { void WebBrowser.openBrowserAsync(value); } }]);
  const save = async () => {
    if (saving || saved) return;
    setSaving(true);
    setSaveError(null);
    try {
      await saveHistoryRecord(db, assessment, historyKindForResult(kind), value);
      setSaved(true);
    } catch {
      setSaveError('Kayıt cihazda oluşturulamadı. Daha sonra yeniden deneyebilirsiniz.');
    } finally {
      setSaving(false);
    }
  };
  return <Screen contentContainerStyle={{ gap: 0, paddingHorizontal: 14 }}>
    <Surface style={{ padding: 0, overflow: 'hidden', borderColor: colors.border }}>
      <View style={{ minHeight: 190, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 18, backgroundColor: palette.bg, borderBottomWidth: 1, borderBottomColor: palette.color, boxShadow: assessment.verdict === 'BLOCK' ? shadows.dangerGlow : shadows.card }}><View style={{ position: 'absolute', width: 250, height: 250, borderRadius: radius.full, backgroundColor: `${palette.color}0B` }} /><N0Symbol name={palette.icon} size={55} tintColor={palette.color} /><N0Text variant="title" style={{ fontSize: 25 }}>{palette.title}</N0Text><N0Text variant="heading" style={{ color: palette.color, fontSize: 20 }}>{palette.label}</N0Text><N0Text variant="small" style={{ textAlign: 'center', color: colors.text }}>Bu içerikte doğrulama gerektiren analitik işaretler bulundu.</N0Text></View>
      <View style={{ paddingHorizontal: 17, paddingTop: 18 }}><N0Text variant="title" style={{ fontSize: 21 }}>Tespit Edilen İşaretler</N0Text></View>
      <View style={{ padding: 17, gap: 0 }}>{assessment.evidence.map((item, index) => <View key={item.title} style={{ minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 13, borderBottomWidth: index === assessment.evidence.length - 1 ? 0 : 1, borderBottomColor: colors.separator }}><View style={{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: palette.color, alignItems: 'center', justifyContent: 'center', boxShadow: assessment.verdict === 'BLOCK' ? shadows.dangerGlow : shadows.card }}><N0Symbol name={iconForEvidence(item.title)} size={19} tintColor={colors.background} /></View><View style={{ flex: 1, gap: 2 }}><N0Text variant="body" style={{ color: colors.text }}>{item.title}</N0Text><N0Text variant="caption">{item.detail}</N0Text></View></View>)}</View>
      {showActions ? <View style={{ borderTopWidth: 1, borderTopColor: colors.separator, paddingHorizontal: 17, paddingVertical: 14, gap: 9 }}>{assessment.actions.map((action) => <View key={action} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><N0Symbol name="checkmark.circle.fill" size={16} /><N0Text variant="small" style={{ flex: 1, color: colors.text }}>{action}</N0Text></View>)}</View> : null}
      <View style={{ padding: 12, gap: 10 }}><ActionButton title={showActions ? 'Güvenli Seçenekleri Gizle' : 'Güvenli Seçenekleri Gör'} onPress={() => setShowActions((shown) => !shown)} /><ActionButton title={saved ? 'Geçmişe Kaydedildi' : 'Geçmişe Kaydet'} variant="secondary" onPress={() => void save()} loading={saving} disabled={saved} />{saveError ? <N0Text variant="caption" style={{ color: colors.danger, textAlign: 'center' }}>{saveError}</N0Text> : null}{kind !== 'MESSAGE' && /^https?:\/\//i.test(value) ? <ActionButton title="Yine de Aç" variant="danger" onPress={openAnyway} /> : <ActionButton title="Geri Dön" variant="secondary" onPress={() => router.back()} />}</View>
    </Surface>
    <N0Text variant="caption" style={{ textAlign: 'center', paddingTop: 12 }}>Sonuç analitiktir, tavsiye değildir.</N0Text>
  </Screen>;
}
