export const WEEKLY_PROTECTION_REMINDER_KIND = 'weekly-protection-review';
export const WEEKLY_PROTECTION_REMINDER_ID = 'n0scam-weekly-protection-review';

type NotificationRequestLike = {
  identifier?: unknown;
  content?: { data?: unknown };
};

export function isWeeklyProtectionReminder(request: unknown) {
  if (!request || typeof request !== 'object') return false;
  const candidate = request as NotificationRequestLike;
  if (candidate.identifier === WEEKLY_PROTECTION_REMINDER_ID) return true;
  if (!candidate.content?.data || typeof candidate.content.data !== 'object') return false;
  return (candidate.content.data as Record<string, unknown>).kind === WEEKLY_PROTECTION_REMINDER_KIND;
}
