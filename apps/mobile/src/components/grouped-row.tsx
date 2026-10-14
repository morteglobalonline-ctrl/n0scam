import { Pressable, View } from 'react-native';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { colors, radius, spacing } from '@/theme';
import type { ComponentProps, ReactNode } from 'react';

export function GroupedRow({ icon, title, detail, trailing, last = false, onPress, iconTone = 'brand' }: {
  icon: ComponentProps<typeof N0Symbol>['name']; title: string; detail?: string; trailing?: ReactNode; last?: boolean; onPress?: () => void; iconTone?: 'brand' | 'danger' | 'neutral';
}) {
  const tone = iconTone === 'danger' ? colors.danger : iconTone === 'neutral' ? colors.textSecondary : colors.brand;
  return <Pressable disabled={!onPress} onPress={onPress} accessibilityRole={onPress ? 'button' : undefined} style={({ pressed }) => ({ minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: spacing.md, paddingVertical: 9, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.separator, opacity: pressed ? 0.62 : 1 })}>
    <View style={{ width: 31, height: 31, borderRadius: radius.sm, backgroundColor: iconTone === 'danger' ? colors.dangerMuted : colors.brandWash, borderWidth: 1, borderColor: `${tone}22`, alignItems: 'center', justifyContent: 'center' }}><N0Symbol name={icon} size={17} tintColor={tone} /></View>
    <View style={{ flex: 1, gap: 1 }}><N0Text variant="headline">{title}</N0Text>{detail ? <N0Text variant="caption" numberOfLines={2}>{detail}</N0Text> : null}</View>
    {trailing ?? (onPress ? <N0Symbol name="chevron.right" size={12} tintColor={colors.textMuted} /> : null)}
  </Pressable>;
}
