import { CameraView, scanFromURLAsync, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { colors, radius, spacing } from '@/theme';

const corners = [
  { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
] as const;

export default function QrScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onBarcodeScanned = ({ data }: BarcodeScanningResult) => { if (locked) return; setLocked(true); router.replace({ pathname: '/risk-result', params: { kind: 'QR', value: data } }); };
  const pickFromLibrary = async () => { try { setError(null); const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 }); if (result.canceled) return; const codes = await scanFromURLAsync(result.assets[0].uri, ['qr']); if (!codes.length) { setError('Bu görselde okunabilir bir QR kodu bulunamadı.'); return; } onBarcodeScanned(codes[0]); } catch { setError('Görsel incelenemedi. Başka bir fotoğraf deneyebilirsin.'); } };
  if (!permission) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  if (!permission.granted) return <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.xl, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}><View style={{ width: 68, height: 68, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="camera.fill" size={30} /></View><View style={{ alignItems: 'center', gap: 5 }}><N0Text variant="heading">Kamera izni gerekiyor</N0Text><N0Text variant="small" style={{ textAlign: 'center' }}>QR kodu cihazında çözmek için kamera erişimi gerekir. Kod otomatik açılmaz.</N0Text></View>{error ? <N0Text variant="small" style={{ color: colors.danger, textAlign: 'center' }}>{error}</N0Text> : null}<ActionButton title="Kameraya İzin Ver" onPress={() => void requestPermission()} style={{ alignSelf: 'stretch' }} /><ActionButton title="Fotoğraftan Seç" variant="secondary" onPress={() => void pickFromLibrary()} style={{ alignSelf: 'stretch' }} /><ActionButton title="Linki Elle Gir" variant="secondary" onPress={() => router.replace('/link-analysis')} style={{ alignSelf: 'stretch' }} /></View>;
  return <View style={{ flex: 1, backgroundColor: colors.background }}><CameraView style={{ flex: 1 }} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={locked ? undefined : onBarcodeScanned} />
    <View pointerEvents="none" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.18)', alignItems: 'center', justifyContent: 'center' }}><View style={{ width: 254, height: 254 }}>{corners.map((corner, index) => <View key={index} style={{ position: 'absolute', width: 48, height: 48, borderColor: colors.brand, ...corner }} />)}<View style={{ position: 'absolute', top: '50%', left: 12, right: 12, height: 1, backgroundColor: colors.brand, boxShadow: '0 0 12px rgba(0,255,138,0.85)' }} /></View></View>
    <View style={{ position: 'absolute', left: 24, right: 24, bottom: 46, alignItems: 'center', gap: 15 }}><View style={{ backgroundColor: 'rgba(1,5,4,0.87)', borderColor: colors.separator, borderWidth: 1, borderRadius: radius.full, paddingHorizontal: 17, paddingVertical: 10 }}><N0Text variant="caption" style={{ textAlign: 'center', color: colors.text }}>QR kodunu çerçevenin içine getir</N0Text>{error ? <N0Text variant="caption" style={{ color: colors.danger, textAlign: 'center' }}>{error}</N0Text> : null}</View><View style={{ flexDirection: 'row', justifyContent: 'center', gap: 46 }}><Pressable onPress={() => void pickFromLibrary()} accessibilityRole="button" style={({ pressed }) => ({ alignItems: 'center', gap: 6, opacity: pressed ? 0.6 : 1 })}><View style={{ width: 52, height: 52, borderRadius: radius.full, borderWidth: 1, borderColor: colors.text, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="photo.fill" size={20} tintColor={colors.text} /></View><N0Text variant="caption" style={{ color: colors.text }}>Fotoğraftan Seç</N0Text></Pressable><View style={{ alignItems: 'center', gap: 6 }}><View style={{ width: 52, height: 52, borderRadius: radius.full, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="qrcode.viewfinder" size={23} tintColor={colors.background} /></View><N0Text variant="caption" style={{ color: colors.text }}>QR Tara</N0Text></View></View></View>
  </View>;
}
