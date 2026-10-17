import { ExtensionStorage } from '@bacons/apple-targets';
import { parseShareHeartbeat } from '@/domain/protection';

const protectionStorage = new ExtensionStorage('group.com.morteglobalonline.n0scam.protection');

export function readShareProtectionHeartbeat(now = Date.now()) {
  return parseShareHeartbeat(protectionStorage.get('share.lastEvaluationAt'), now);
}
