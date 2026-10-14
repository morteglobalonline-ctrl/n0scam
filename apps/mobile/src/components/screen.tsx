import type { PropsWithChildren } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { colors, spacing } from '@/theme';

export function Screen({ children, contentContainerStyle, ...props }: PropsWithChildren<ScrollViewProps>) {
  return <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={[{ paddingHorizontal: 14, paddingTop: spacing.md, paddingBottom: 104, gap: spacing.lg }, contentContainerStyle]} {...props}>{children}</ScrollView>;
}
