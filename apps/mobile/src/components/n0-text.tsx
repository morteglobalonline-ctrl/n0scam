import type { TextProps, TextStyle } from 'react-native';
import { Text } from 'react-native';
import { colors, fonts } from '@/theme';

const variants = {
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, color: colors.text },
  heading: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22, color: colors.text },
  headline: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.text },
  small: { fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 17, color: colors.textSecondary },
  caption: { fontFamily: fonts.medium, fontSize: 9.5, lineHeight: 14, color: colors.textSecondary },
} satisfies Record<string, TextStyle>;

export function N0Text({ variant = 'body', style, ...props }: TextProps & { variant?: keyof typeof variants }) {
  return <Text selectable style={[variants[variant], style]} {...props} />;
}
