import { View } from 'react-native';
import { N0Text } from '@/components/n0-text';
import { colors } from '@/theme';

export function BrandWordmark({ compact = false }: { compact?: boolean }) {
  return <View accessibilityLabel="n0scam" style={{ flexDirection: 'row', alignItems: 'baseline' }}>
    <N0Text style={{ fontFamily: 'Sora_700Bold', fontSize: compact ? 20 : 25, lineHeight: compact ? 25 : 31, letterSpacing: -1.1 }}>n</N0Text>
    <N0Text style={{ fontFamily: 'Sora_700Bold', fontSize: compact ? 20 : 25, lineHeight: compact ? 25 : 31, letterSpacing: -1.1, color: colors.brand }}>0</N0Text>
    <N0Text style={{ fontFamily: 'Sora_700Bold', fontSize: compact ? 20 : 25, lineHeight: compact ? 25 : 31, letterSpacing: -1.1 }}>scam</N0Text>
  </View>;
}
