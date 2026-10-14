import type { TextProps, TextStyle } from 'react-native';
import { Text } from 'react-native';
import { colors, fonts } from '@/theme';

const variants = {
  title: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34, color: colors.text },
  heading: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26, color: colors.text },
  headline: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.text },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
  caption: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 16, color: colors.textSecondary },
} satisfies Record<string, TextStyle>;

export function N0Text({ variant = 'body', style, ...props }: TextProps & { variant?: keyof typeof variants }) {
  return <Text selectable style={[variants[variant], style]} {...props} />;
}
