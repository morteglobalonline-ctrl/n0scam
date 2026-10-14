import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/theme';

export function Surface({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[{ backgroundColor: colors.surface, borderColor: colors.separator, borderWidth: 1, borderRadius: radius.lg, borderCurve: 'continuous', padding: spacing.md, boxShadow: shadows.card }, style]}>{children}</View>;
}
