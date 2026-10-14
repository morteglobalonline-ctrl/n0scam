import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { N0Text } from '@/components/n0-text';
import { colors, radius, spacing } from '@/theme';

export function ActionButton({ title, onPress, variant = 'primary', disabled = false, loading = false, style }: { title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean; loading?: boolean; style?: StyleProp<ViewStyle> }) {
  const palette = { primary: { background: colors.brand, foreground: colors.background, border: colors.brand }, secondary: { background: colors.surfaceRaised, foreground: colors.text, border: colors.separator }, danger: { background: colors.dangerMuted, foreground: colors.danger, border: colors.danger } }[variant];
  const handlePress = () => { if (process.env.EXPO_OS === 'ios') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); };
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled: disabled || loading, busy: loading }} disabled={disabled || loading} onPress={handlePress} style={({ pressed }) => [{ minHeight: 43, paddingHorizontal: spacing.lg, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderCurve: 'continuous', borderWidth: 1, borderColor: palette.border, backgroundColor: palette.background, opacity: disabled ? 0.42 : pressed ? 0.72 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }, style]}>{loading ? <ActivityIndicator color={palette.foreground} /> : <N0Text variant="headline" style={{ color: palette.foreground }}>{title}</N0Text>}</Pressable>;
}
