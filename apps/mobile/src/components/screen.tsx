import type { PropsWithChildren } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { colors, spacing } from '@/theme';

export function Screen({ children, contentContainerStyle, ...props }: PropsWithChildren<ScrollViewProps>) {
  return <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={[{ padding: spacing.lg, paddingBottom: 120, gap: spacing.xl }, contentContainerStyle]} {...props}>{children}</ScrollView>;
}
