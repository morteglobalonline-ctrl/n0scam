import { CameraView, scanFromURLAsync, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { colors, radius, spacing } from '@/theme';

export default function QrScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onBarcodeScanned = ({ data }: BarcodeScanningResult) => { if (locked) return; setLocked(true); router.replace({ pathname: '/risk-result', params: { kind: 'QR', value: data } }); };
  const pickFromLibrary = async () => {
    try {
      setError(null);
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 });
      if (result.canceled) return;
      const codes = await scanFromURLAsync(result.assets[0].uri, ['qr']);
      if (!codes.length) { setError('Bu görselde okunabilir bir QR kodu bulunamadı.'); return; }
      onBarcodeScanned(codes[0]);
    } catch {
      setError('Görsel incelenemedi. Başka bir fotoğraf deneyebilirsin.');
    }
  };
  if (!permission) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  if (!permission.granted) return <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.xl, alignItems: 'center', justifyContent: 'center', gap: spacing.xl }}><View style={{ width: 76, height: 76, borderRadius: radius.full, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="camera.fill" size={34} /></View><View style={{ alignItems: 'center', gap: spacing.sm }}><N0Text variant="heading">Kamera izni gerekiyor</N0Text><N0Text variant="small" style={{ textAlign: 'center' }}>QR kodunu cihazında çözmek için kamera erişimi isteyeceğiz. Kod otomatik açılmaz.</N0Text></View>{error ? <N0Text variant="small" style={{ color: colors.danger, textAlign: 'center' }}>{error}</N0Text> : null}<ActionButton title="Kameraya İzin Ver" onPress={() => void requestPermission()} style={{ alignSelf: 'stretch' }} /><ActionButton title="Fotoğraftan Seç" variant="secondary" onPress={() => void pickFromLibrary()} style={{ alignSelf: 'stretch' }} /><ActionButton title="Linki Elle Gir" variant="secondary" onPress={() => router.replace('/link-analysis')} style={{ alignSelf: 'stretch' }} /></View>;
  return <View style={{ flex: 1, backgroundColor: colors.background }}><CameraView style={{ flex: 1 }} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={locked ? undefined : onBarcodeScanned} /><View pointerEvents="none" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}><View style={{ width: 260, height: 260, borderColor: colors.brand, borderWidth: 3, borderRadius: radius.xl, borderCurve: 'continuous' }} /></View><View style={{ position: 'absolute', left: spacing.xl, right: spacing.xl, bottom: 64, backgroundColor: 'rgba(0,0,0,0.78)', borderRadius: radius.lg, borderCurve: 'continuous', padding: spacing.lg, gap: spacing.sm }}><N0Text variant="headline" style={{ textAlign: 'center' }}>QR kodunu çerçeveye getir</N0Text><N0Text variant="caption" style={{ textAlign: 'center' }}>Hedefi açmadan önce içeriği ve risk işaretlerini göstereceğiz.</N0Text>{error ? <N0Text variant="caption" style={{ color: colors.danger, textAlign: 'center' }}>{error}</N0Text> : null}<Pressable onPress={() => void pickFromLibrary()} accessibilityRole="button" style={({ pressed }) => ({ minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surfaceRaised, opacity: pressed ? 0.7 : 1 })}><N0Symbol name="photo.fill" size={18} /><N0Text variant="small" style={{ color: colors.text }}>Fotoğraftan seç</N0Text></Pressable></View></View>;
}
