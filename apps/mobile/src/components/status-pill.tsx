import { View } from 'react-native';
import { N0Text } from '@/components/n0-text';
import { colors, radius } from '@/theme';

export function StatusPill({ tone = 'neutral', label }: { tone?: 'neutral' | 'warning' | 'danger' | 'brand'; label: string }) {
  const palette = { neutral: { background: colors.surfaceRaised, foreground: colors.textSecondary }, warning: { background: colors.warningMuted, foreground: colors.warning }, danger: { background: colors.dangerMuted, foreground: colors.danger }, brand: { background: colors.brandMuted, foreground: colors.brand } }[tone];
  return <View style={{ backgroundColor: palette.background, paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.full, borderWidth: 1, borderColor: `${palette.foreground}33` }}><N0Text variant="caption" style={{ color: palette.foreground }}>{label}</N0Text></View>;
}
