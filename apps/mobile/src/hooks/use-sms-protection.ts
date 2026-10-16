import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { readSmsProtectionHeartbeat } from '@/services/sms-protection';

export function useSmsProtectionHeartbeat() {
  const [heartbeat, setHeartbeat] = useState(() => readSmsProtectionHeartbeat());
  useFocusEffect(useCallback(() => { setHeartbeat(readSmsProtectionHeartbeat()); }, []));
  return heartbeat;
}
