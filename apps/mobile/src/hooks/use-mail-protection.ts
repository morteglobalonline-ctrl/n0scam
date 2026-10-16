import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { connectorApi, type MailConnectionStatus } from '@/services/connector-api';

type MailStatuses = { gmail: MailConnectionStatus | null; outlook: MailConnectionStatus | null };

export function useMailProtectionStatuses() {
  const [statuses, setStatuses] = useState<MailStatuses>({ gmail: null, outlook: null });

  useFocusEffect(useCallback(() => {
    if (!connectorApi.configured) return;
    const controller = new AbortController();
    let active = true;
    void Promise.allSettled([
      connectorApi.getGmailStatus(controller.signal),
      connectorApi.getOutlookStatus(controller.signal),
    ]).then(([gmail, outlook]) => {
      if (!active) return;
      setStatuses({
        gmail: gmail.status === 'fulfilled' ? gmail.value : null,
        outlook: outlook.status === 'fulfilled' ? outlook.value : null,
      });
    });
    return () => { active = false; controller.abort(); };
  }, []));

  return statuses;
}
