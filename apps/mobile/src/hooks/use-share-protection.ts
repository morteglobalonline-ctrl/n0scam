import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { readShareProtectionHeartbeat } from '@/services/share-protection';

export function useShareProtectionHeartbeat() {
  const [heartbeat, setHeartbeat] = useState(() => readShareProtectionHeartbeat());
  useFocusEffect(useCallback(() => { setHeartbeat(readShareProtectionHeartbeat()); }, []));
  return heartbeat;
}
