import { CameraView, scanFromURLAsync, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/action-button';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { colors, radius, spacing } from '@/theme';

const corners = [
  { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
] as const;

export default function QrScannerScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [torch, setTorch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onBarcodeScanned = ({ data }: BarcodeScanningResult) => { if (locked) return; setLocked(true); router.replace({ pathname: '/risk-result', params: { kind: 'QR', value: data } }); };
  const pickFromLibrary = async () => { try { setError(null); const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 }); if (result.canceled) return; const codes = await scanFromURLAsync(result.assets[0].uri, ['qr']); if (!codes.length) { setError('Bu görselde okunabilir bir QR kodu bulunamadı.'); return; } onBarcodeScanned(codes[0]); } catch { setError('Görsel incelenemedi. Başka bir fotoğraf deneyebilirsiniz.'); } };
  if (!permission) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  if (!permission.granted) return <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl, paddingHorizontal: spacing.xl, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}><View style={{ width: 76, height: 76, borderRadius: radius.full, backgroundColor: colors.brandWash, borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="camera.fill" size={34} /></View><View style={{ alignItems: 'center', gap: 7 }}><N0Text variant="heading">Kamera izni gerekiyor</N0Text><N0Text variant="small" style={{ textAlign: 'center' }}>QR kodunu cihazınızda çözmek için kamera erişimi gerekir. Kod otomatik açılmaz.</N0Text></View>{error ? <N0Text variant="small" style={{ color: colors.danger, textAlign: 'center' }}>{error}</N0Text> : null}<ActionButton title="Kameraya İzin Ver" onPress={() => void requestPermission()} style={{ alignSelf: 'stretch' }} /><ActionButton title="Fotoğraftan Seç" variant="secondary" onPress={() => void pickFromLibrary()} style={{ alignSelf: 'stretch' }} /><ActionButton title="Linki Elle Gir" variant="secondary" onPress={() => router.replace('/link-analysis')} style={{ alignSelf: 'stretch' }} /></View>;
  return <View style={{ flex: 1, backgroundColor: colors.background }}>
    <CameraView style={{ flex: 1 }} facing="back" enableTorch={torch} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={locked ? undefined : onBarcodeScanned} />
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: insets.top + 78, paddingTop: insets.top, paddingHorizontal: 22, backgroundColor: 'rgba(0,0,0,0.88)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Geri"><N0Symbol name="arrow.left" size={28} tintColor={colors.text} /></Pressable><N0Text variant="title" style={{ fontSize: 22 }}>QR Kod Tara</N0Text><Pressable onPress={() => setTorch((active) => !active)} hitSlop={12} accessibilityRole="button" accessibilityLabel={torch ? 'Flaşı kapat' : 'Flaşı aç'} accessibilityState={{ selected: torch }}><N0Symbol name={torch ? 'bolt.fill' : 'bolt'} size={27} tintColor={torch ? colors.brand : colors.text} /></Pressable></View>
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: insets.top + 78, bottom: 0, backgroundColor: 'rgba(0,0,0,0.12)', alignItems: 'center', paddingTop: '21%' }}><View style={{ width: '72%', aspectRatio: 1 }}>{corners.map((corner, index) => <View key={index} style={{ position: 'absolute', width: 52, height: 52, borderColor: colors.brand, boxShadow: '0 0 15px rgba(0,255,138,0.55)', ...corner }} />)}<View style={{ position: 'absolute', top: '50%', left: 3, right: 3, height: 2, backgroundColor: colors.brand, boxShadow: '0 0 14px rgba(0,255,138,0.95)' }} /></View></View>
    <View style={{ position: 'absolute', left: 20, right: 20, bottom: insets.bottom + 28, alignItems: 'center', gap: 22 }}><View style={{ alignSelf: 'stretch', backgroundColor: 'rgba(1,12,9,0.91)', borderColor: colors.border, borderWidth: 1, borderRadius: radius.xl, paddingHorizontal: 18, paddingVertical: 18, gap: 5 }}><N0Text variant="heading" style={{ textAlign: 'center' }}>QR kodu tarayın</N0Text><N0Text variant="body" style={{ textAlign: 'center', color: colors.textSecondary }}>Bağlantıyı açmadan önce güvenlik kontrolü yapalım.</N0Text>{error ? <N0Text variant="small" style={{ color: colors.danger, textAlign: 'center' }}>{error}</N0Text> : null}</View><View style={{ flexDirection: 'row', justifyContent: 'center', gap: 58 }}><Pressable onPress={() => void pickFromLibrary()} accessibilityRole="button" style={({ pressed }) => ({ alignItems: 'center', gap: 8, opacity: pressed ? 0.6 : 1 })}><View style={{ width: 72, height: 72, borderRadius: radius.full, borderWidth: 1, borderColor: colors.brand, backgroundColor: 'rgba(0,10,7,0.84)', alignItems: 'center', justifyContent: 'center' }}><N0Symbol name="photo.fill" size={29} tintColor={colors.text} /></View><N0Text variant="headline">Fotoğraftan Seç</N0Text></Pressable><Pressable onPress={() => { setLocked(false); setError(null); }} accessibilityRole="button" style={({ pressed }) => ({ alignItems: 'center', gap: 8, opacity: pressed ? 0.6 : 1 })}><View style={{ width: 72, height: 72, borderRadius: radius.full, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0,255,138,0.20)' }}><N0Symbol name="qrcode.viewfinder" size={31} tintColor={colors.background} /></View><N0Text variant="headline">QR Tara</N0Text></Pressable></View></View>
  </View>;
}
