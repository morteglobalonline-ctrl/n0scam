import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { colors } from '@/theme';

export function N0Symbol({ size = 22, tintColor = colors.brand, ...props }: SymbolViewProps) {
  return <SymbolView size={size} tintColor={tintColor} {...props} />;
}
