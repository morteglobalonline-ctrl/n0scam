import { Platform } from 'react-native';
import SafariExtensionState from '../../modules/safari-extension-state';
import { parseSafariExtensionState } from '@/domain/protection';

export async function readSafariExtensionState() {
  if (Platform.OS !== 'ios' || !SafariExtensionState) return 'UNAVAILABLE' as const;
  try { return parseSafariExtensionState(await SafariExtensionState.getState()); }
  catch { return 'UNAVAILABLE' as const; }
}
