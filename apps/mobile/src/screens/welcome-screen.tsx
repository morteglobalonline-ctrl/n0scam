import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/action-button';
import { N0Text } from '@/components/n0-text';
import { colors, radius, spacing } from '@/theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const enterApp = () => router.replace('/');
  return <View style={{ flex: 1, overflow: 'hidden', backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, spacing.md) }}>
    <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl }}>
      <Image source={require('@/assets/images/n0scam-logo.png')} contentFit="contain" accessibilityLabel="n0scam" style={{ width: '92%', maxWidth: 430, height: '48%' }} />
      <N0Text variant="body" style={{ color: colors.textSecondary, letterSpacing: 4, textAlign: 'center', marginTop: -28 }}>Think Before You Trust.</N0Text>
    </View>
    <Image source={require('@/assets/images/n0scam-mountains.png')} contentFit="cover" contentPosition="center" style={{ position: 'absolute', left: 0, right: 0, top: '42%', width: '100%', height: '38%', opacity: 0.92 }} />
    <View style={{ paddingHorizontal: spacing.xl, gap: spacing.md }}>
      <View accessibilityLabel="Tanıtım sayfası 1 / 3" style={{ flexDirection: 'row', alignSelf: 'center', gap: 10, paddingBottom: 2 }}><View style={{ width: 10, height: 10, borderRadius: radius.full, backgroundColor: colors.brand }} /><View style={{ width: 10, height: 10, borderRadius: radius.full, backgroundColor: colors.textMuted }} /><View style={{ width: 10, height: 10, borderRadius: radius.full, backgroundColor: colors.textMuted }} /></View>
      <ActionButton title="Başlayın" onPress={enterApp} style={{ minHeight: 58 }} />
      <Pressable onPress={enterApp} accessibilityRole="button" style={({ pressed }) => ({ minHeight: 50, borderRadius: radius.md, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.brand, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.65 : 1 })}><N0Text variant="headline" style={{ fontSize: 14 }}>Zaten hesabım var</N0Text></Pressable>
      <View style={{ height: 2 }} />
    </View>
  </View>;
}
