import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { readSafariExtensionState } from '@/services/safari-protection';

export function useSafariExtensionState() {
  const [state, setState] = useState<'UNKNOWN' | 'ENABLED' | 'DISABLED' | 'UNAVAILABLE'>('UNKNOWN');
  useFocusEffect(useCallback(() => {
    let active = true;
    void readSafariExtensionState().then((next) => { if (active) setState(next); });
    return () => { active = false; };
  }, []));
  return state;
}
