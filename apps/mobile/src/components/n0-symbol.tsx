import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { colors } from '@/theme';

type SymbolName = Extract<SymbolViewProps['name'], string>;
type MaterialName = ComponentProps<typeof MaterialIcons>['name'];

const androidIcons: Record<string, MaterialName> = {
  'arrow.left': 'arrow-back',
  'bell.fill': 'notifications',
  bolt: 'flash-on',
  'bolt.fill': 'flash-on',
  'building.columns.fill': 'account-balance',
  'camera.fill': 'photo-camera',
  'checkmark.circle.fill': 'check-circle',
  'checkmark.seal.fill': 'verified',
  'checkmark.shield.fill': 'verified-user',
  'chevron.right': 'chevron-right',
  clock: 'schedule',
  'clock.arrow.circlepath': 'history',
  'creditcard.fill': 'credit-card',
  'crown.fill': 'workspace-premium',
  'doc.fill': 'insert-drive-file',
  'doc.text.fill': 'description',
  'envelope.fill': 'email',
  exclamationmark: 'error-outline',
  'exclamationmark.circle.fill': 'error',
  'exclamationmark.triangle.fill': 'warning',
  gearshape: 'settings',
  globe: 'public',
  'house.fill': 'home',
  'info.circle.fill': 'info',
  link: 'link',
  'lock.shield.fill': 'lock',
  'message.fill': 'message',
  'moon.fill': 'dark-mode',
  network: 'hub',
  'paintpalette.fill': 'palette',
  'person.2.fill': 'group',
  'person.crop.circle.fill': 'account-circle',
  'person.crop.square': 'person',
  'person.text.rectangle.fill': 'badge',
  'photo.fill': 'photo',
  'qrcode.viewfinder': 'qr-code-scanner',
  'questionmark.circle.fill': 'help',
  safari: 'explore',
  shield: 'shield',
  'shield.fill': 'shield',
  'shield.slash.fill': 'gpp-bad',
  'square.and.arrow.down.fill': 'download',
  viewfinder: 'center-focus-strong',
  xmark: 'close',
};

export function N0Symbol({ name, size = 22, tintColor = colors.brand }: {
  name: SymbolName;
  size?: number;
  tintColor?: ColorValue;
}) {
  if (process.env.EXPO_OS === 'android') {
    return <MaterialIcons name={androidIcons[name] ?? 'help-outline'} size={size} color={tintColor} />;
  }

  return <SymbolView name={name} size={size} tintColor={tintColor} resizeMode="scaleAspectFit" />;
}
