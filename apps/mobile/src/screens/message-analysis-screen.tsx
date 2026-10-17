import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
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
import { extractDocumentText, recognizeImageText } from '@/services/document-text';
import { colors, fonts, radius, shadows } from '@/theme';

const modes = ['Metin', 'Ekran Görüntüsü', 'Dosya'] as const;
type Mode = (typeof modes)[number];

function ExtractionInput({ value, onChange, error, placeholder }: { value: string; onChange: (value: string) => void; error: string | null; placeholder: string }) {
  return <View><TextInput value={value} onChangeText={onChange} multiline textAlignVertical="top" maxLength={5000} placeholder={placeholder} placeholderTextColor={colors.textMuted} accessibilityLabel="Analiz edilecek metin" style={{ minHeight: 190, color: colors.text, backgroundColor: colors.surface, borderColor: error ? colors.danger : colors.border, borderWidth: 1, borderRadius: radius.lg, borderCurve: 'continuous', padding: 17, paddingBottom: 34, fontFamily: fonts.regular, fontSize: 14, lineHeight: 23 }} /><N0Text variant="small" style={{ position: 'absolute', right: 14, bottom: 10, fontVariant: ['tabular-nums'] }}>{value.length}/5000</N0Text></View>;
}

export default function MessageAnalysisScreen() {
  const params = useLocalSearchParams<{ value?: string | string[]; source?: string | string[]; mode?: string | string[] }>();
  const inboundValue = readInboundValue(params.value, 5000);
  const fromExtension = hasTrustedIntakeSource(params.source);
  const requestedMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const initialMode: Mode = requestedMode === 'screenshot' ? 'Ekran Görüntüsü' : requestedMode === 'file' ? 'Dosya' : 'Metin';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [values, setValues] = useState<Record<Mode, string>>({ Metin: inboundValue, 'Ekran Görüntüsü': '', Dosya: '' });
  const [assessment, setAssessment] = useState<LocalAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractionNote, setExtractionNote] = useState<string | null>(null);
  const value = values[mode];

  const setValue = (next: string) => {
    setValues((current) => ({ ...current, [mode]: next }));
    setAssessment(null);
    setError(null);
  };

  const selectMode = (next: Mode) => {
    setMode(next);
    setAssessment(null);
    setError(null);
    setExtractionNote(null);
  };

  const submit = () => {
    try {
      setAssessment(analyzeMessage(value));
      setError(null);
    } catch (cause) {
      setAssessment(null);
      setError(cause instanceof Error ? cause.message : 'Mesaj incelenemedi.');
    }
  };

  const pickScreenshot = async () => {
    try {
      setProcessing(true);
      setError(null);
      setExtractionNote(null);
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 });
      if (result.canceled) return;
      const asset = result.assets[0];
      setImageUri(asset.uri);
      const extracted = await recognizeImageText(asset.uri);
      setValues((current) => ({ ...current, 'Ekran Görüntüsü': extracted.text }));
      setExtractionNote(extracted.truncated ? 'Metin cihazda okundu; ilk 5.000 karakter gösteriliyor.' : 'Metin cihazda okundu. Analizden önce düzenleyebilirsiniz.');
      setAssessment(null);
    } catch (cause) {
      setValues((current) => ({ ...current, 'Ekran Görüntüsü': '' }));
      setError(cause instanceof Error ? cause.message : 'Ekran görüntüsü okunamadı.');
    } finally {
      setProcessing(false);
    }
  };

  const pickFile = async () => {
    try {
      setProcessing(true);
      setError(null);
      setExtractionNote(null);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'text/markdown', 'message/rfc822', 'text/csv', 'application/json'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      setFileName(asset.name);
      const extracted = await extractDocumentText(asset.uri);
      setValues((current) => ({ ...current, Dosya: extracted.text }));
      const pages = extracted.pageCount ? `${extracted.pageCount} sayfalı PDF` : 'Dosya';
      setExtractionNote(extracted.truncated ? `${pages} cihazda okundu; ilk 5.000 karakter gösteriliyor.` : `${pages} cihazda okundu. Analizden önce düzenleyebilirsiniz.`);
      setAssessment(null);
    } catch (cause) {
      setValues((current) => ({ ...current, Dosya: '' }));
      setError(cause instanceof Error ? cause.message : 'Dosya okunamadı.');
    } finally {
      setProcessing(false);
    }
  };

  const tone = assessment?.verdict === 'BLOCK' ? colors.danger : assessment?.verdict === 'WARN' ? colors.warning : colors.info;
  const extractedMode = mode !== 'Metin';

  return <View style={{ flex: 1, backgroundColor: colors.background }}><Screen contentContainerStyle={{ gap: 15 }}>
    {fromExtension && inboundValue ? <Surface style={{ flexDirection: 'row', gap: 11, alignItems: 'center' }}><N0Symbol name="square.and.arrow.down.fill" size={22} /><View style={{ flex: 1, gap: 2 }}><N0Text variant="headline">Paylaşılan içerik hazır</N0Text><N0Text variant="caption">İçerik gönderilmedi veya çalıştırılmadı. Analizi siz başlatın.</N0Text></View></Surface> : null}
    <View style={{ flexDirection: 'row', gap: 7, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 7 }}>{modes.map((label) => <Pressable key={label} onPress={() => selectMode(label)} accessibilityRole="tab" accessibilityState={{ selected: mode === label }} style={({ pressed }) => ({ flex: 1, minHeight: 45, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1, borderColor: mode === label ? colors.brand : colors.separator, backgroundColor: mode === label ? colors.brandWash : colors.backgroundElevated, opacity: pressed ? 0.6 : 1 })}><N0Text variant="small" style={{ color: mode === label ? colors.brand : colors.textSecondary, fontFamily: mode === label ? fonts.semibold : fonts.regular, textAlign: 'center' }}>{label}</N0Text></Pressable>)}</View>

    {mode === 'Ekran Görüntüsü' ? <Surface style={{ gap: 12 }}>
      {imageUri ? <Image source={{ uri: imageUri }} contentFit="contain" style={{ width: '100%', height: 170, borderRadius: radius.md, backgroundColor: colors.backgroundElevated }} accessibilityLabel="Seçilen ekran görüntüsü" /> : <View style={{ minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 8 }}><N0Symbol name="photo.fill" size={36} /><N0Text variant="small">Mesaj veya e-posta ekran görüntüsünü seçin.</N0Text></View>}
      <ActionButton title={imageUri ? 'Başka Görsel Seç' : 'Ekran Görüntüsü Seç'} variant="secondary" onPress={() => void pickScreenshot()} loading={processing} />
    </Surface> : null}

    {mode === 'Dosya' ? <Surface style={{ gap: 12, alignItems: 'center' }}>
      <N0Symbol name="doc.fill" size={38} /><N0Text variant="headline" numberOfLines={2} style={{ textAlign: 'center' }}>{fileName ?? 'PDF, TXT, MD, EML, CSV veya JSON seçin'}</N0Text>
      <N0Text variant="caption" style={{ textAlign: 'center' }}>PDF en fazla 10 MB / 20 sayfa; metin dosyaları en fazla 500 KB.</N0Text>
      <ActionButton title={fileName ? 'Başka Dosya Seç' : 'Dosya Seç'} variant="secondary" onPress={() => void pickFile()} loading={processing} style={{ alignSelf: 'stretch' }} />
    </Surface> : null}

    <View style={{ gap: 9 }}>
      {mode === 'Metin' ? <ExtractionInput value={value} onChange={setValue} error={error} placeholder="Şüpheli mesaj veya e-posta metnini buraya yapıştırın…" /> : value ? <ExtractionInput value={value} onChange={setValue} error={error} placeholder="Çıkarılan metin burada görünecek…" /> : null}
      {extractionNote ? <N0Text variant="caption" style={{ color: colors.brand }}>{extractionNote}</N0Text> : null}
      {error ? <N0Text variant="small" style={{ color: colors.danger }}>{error}</N0Text> : null}
      {(!extractedMode || value) ? <ActionButton title="Analiz Et" onPress={submit} disabled={!value.trim() || processing} /> : null}
    </View>

    {assessment ? <View style={{ gap: 9, borderTopWidth: 1, borderTopColor: colors.separator, paddingTop: 14 }}><N0Text variant="title" style={{ fontSize: 21 }}>Sonuç</N0Text><Surface style={{ minHeight: 110, flexDirection: 'row', alignItems: 'center', gap: 15, padding: 17, backgroundColor: assessment.verdict === 'BLOCK' ? colors.dangerMuted : assessment.verdict === 'WARN' ? colors.warningMuted : colors.surfaceRaised, borderColor: tone, boxShadow: assessment.verdict === 'BLOCK' ? shadows.dangerGlow : shadows.card }}><N0Symbol name="exclamationmark.triangle.fill" size={45} tintColor={tone} /><View style={{ flex: 1, gap: 5 }}><N0Text variant="title" style={{ color: tone, fontSize: 19 }}>{assessment.verdict === 'BLOCK' ? 'Dolandırıcılık Riski' : assessment.verdict === 'WARN' ? 'Şüpheli İçerik' : 'Doğrulanamadı'}</N0Text><N0Text variant="small" style={{ color: colors.text }}>Bu içerikte {assessment.evidence.length} analitik işaret bulundu.</N0Text><Pressable onPress={() => router.push({ pathname: '/risk-result', params: { kind: 'MESSAGE', value } })}><N0Text variant="small" style={{ color: colors.brand }}>Detayları Gör</N0Text></Pressable></View></Surface></View> : null}
    <N0Text variant="caption" style={{ textAlign: 'center' }}>Metin cihazda çıkarılır. Sonuç analitiktir, tavsiye değildir.</N0Text>
  </Screen><StandaloneTabBar active="scan" /></View>;
}
