import { View } from 'react-native';
import { N0Symbol } from '@/components/n0-symbol';
import { N0Text } from '@/components/n0-text';
import { radius } from '@/theme';

const palettes = {
  gmail: { background: '#FFFFFF', foreground: '#EA4335', label: 'M' },
  outlook: { background: '#087BEA', foreground: '#FFFFFF', label: 'O' },
  chrome: { background: '#FFFFFF', foreground: '#4285F4', label: 'C' },
  safari: { background: '#FFFFFF', foreground: '#0A84FF', symbol: 'safari' as const },
  sms: { background: '#00E85F', foreground: '#FFFFFF', symbol: 'message.fill' as const },
  network: { background: '#3421D6', foreground: '#FFFFFF', symbol: 'network' as const },
};

export function VendorIcon({ vendor, size = 42 }: { vendor: keyof typeof palettes; size?: number }) {
  const palette = palettes[vendor];
  return <View style={{ width: size, height: size, borderRadius: radius.md, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.28)' }}>
    {'symbol' in palette ? <N0Symbol name={palette.symbol} size={size * 0.52} tintColor={palette.foreground} /> : <N0Text variant="heading" style={{ color: palette.foreground, fontSize: size * 0.43 }}>{palette.label}</N0Text>}
  </View>;
}
