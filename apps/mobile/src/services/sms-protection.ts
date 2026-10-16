import { ExtensionStorage } from '@bacons/apple-targets';
import { parseSmsHeartbeat } from '@/domain/protection';

const protectionStorage = new ExtensionStorage('group.com.morteglobalonline.n0scam.protection');

export function readSmsProtectionHeartbeat(now = Date.now()) {
  return parseSmsHeartbeat(protectionStorage.get('sms.lastEvaluationAt'), now);
}
