import type { PropsWithChildren } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { colors, spacing } from '@/theme';

export function Screen({ children, contentContainerStyle, ...props }: PropsWithChildren<ScrollViewProps>) {
  return <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={[{ paddingHorizontal: 18, paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.lg }, contentContainerStyle]} {...props}>{children}</ScrollView>;
}
