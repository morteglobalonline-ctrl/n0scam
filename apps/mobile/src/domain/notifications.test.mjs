import assert from 'node:assert/strict';
import test from 'node:test';
import { isWeeklyProtectionReminder, WEEKLY_PROTECTION_REMINDER_ID } from './notifications.ts';

test('recognizes the local weekly reminder without inspecting user content', () => {
  assert.equal(isWeeklyProtectionReminder({ identifier: WEEKLY_PROTECTION_REMINDER_ID, content: { data: {} } }), true);
  assert.equal(isWeeklyProtectionReminder({ identifier: 'other', content: { data: { kind: 'weekly-protection-review' } } }), true);
});

test('rejects unrelated or malformed notification requests', () => {
  assert.equal(isWeeklyProtectionReminder({ identifier: 'other', content: { data: { kind: 'risk-alert' } } }), false);
  assert.equal(isWeeklyProtectionReminder(null), false);
  assert.equal(isWeeklyProtectionReminder({ content: { data: 'weekly-protection-review' } }), false);
});
