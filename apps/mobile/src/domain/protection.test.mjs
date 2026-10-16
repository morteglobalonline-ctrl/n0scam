import assert from 'node:assert/strict';
import test from 'node:test';
import { parseSmsHeartbeat, protectionModules } from './protection.ts';

test('keeps protection modules in the approved UI order', () => {
  assert.deepEqual(
    protectionModules.map((module) => module.id),
    ['gmail', 'outlook', 'safari', 'chrome', 'sms', 'network', 'family'],
  );
});

test('never presents an unverified protection module as active', () => {
  assert.equal(protectionModules.some((module) => module.state === 'ACTIVE'), false);
});

test('provides physical-device setup gates for implemented iOS extensions', () => {
  for (const id of ['safari', 'sms']) {
    const module = protectionModules.find((candidate) => candidate.id === id);
    assert.ok(module);
    assert.ok(module.setupSteps?.length >= 3);
    assert.equal(module.state, 'NOT_CONFIGURED');
  }
});

test('accepts only bounded, recent SMS extension heartbeat timestamps', () => {
  const now = Date.UTC(2026, 9, 16);
  assert.deepEqual(parseSmsHeartbeat(String(now - 60_000), now), { lastEvaluatedAt: now - 60_000, fresh: true });
  assert.equal(parseSmsHeartbeat(String(now - 31 * 24 * 60 * 60 * 1000), now)?.fresh, false);
  assert.equal(parseSmsHeartbeat('not-a-time', now), null);
  assert.equal(parseSmsHeartbeat(String(now + 10 * 60 * 1000), now), null);
});
