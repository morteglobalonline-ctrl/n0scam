import assert from 'node:assert/strict';
import test from 'node:test';
import { getMailConnectionHealth, parseSafariExtensionState, parseShareHeartbeat, parseSmsHeartbeat, protectionModules } from './protection.ts';

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
  for (const id of ['safari', 'chrome', 'sms']) {
    const module = protectionModules.find((candidate) => candidate.id === id);
    assert.ok(module);
    assert.ok(module.setupSteps?.length >= 3);
    assert.equal(module.state, 'NOT_CONFIGURED');
  }
});

test('accepts only bounded, recent share-extension heartbeat timestamps', () => {
  const now = Date.UTC(2026, 9, 17);
  assert.deepEqual(parseShareHeartbeat(String(now - 5_000), now), { lastEvaluatedAt: now - 5_000, fresh: true });
  assert.equal(parseShareHeartbeat(String(now - 31 * 24 * 60 * 60 * 1000), now)?.fresh, false);
  assert.equal(parseShareHeartbeat('https://private.example/path', now), null);
});

test('accepts only bounded, recent SMS extension heartbeat timestamps', () => {
  const now = Date.UTC(2026, 9, 16);
  assert.deepEqual(parseSmsHeartbeat(String(now - 60_000), now), { lastEvaluatedAt: now - 60_000, fresh: true });
  assert.equal(parseSmsHeartbeat(String(now - 31 * 24 * 60 * 60 * 1000), now)?.fresh, false);
  assert.equal(parseSmsHeartbeat('not-a-time', now), null);
  assert.equal(parseSmsHeartbeat(String(now + 10 * 60 * 1000), now), null);
});

test('requires a recent mail health check before presenting a connection as verified', () => {
  const now = Date.UTC(2026, 9, 16);
  assert.equal(getMailConnectionHealth(null, now), 'DISCONNECTED');
  assert.equal(getMailConnectionHealth({ state: 'CONNECTED', lastHealthCheckAt: null }, now), 'DEGRADED');
  assert.equal(getMailConnectionHealth({ state: 'DEGRADED', lastHealthCheckAt: new Date(now).toISOString() }, now), 'DEGRADED');
  assert.equal(getMailConnectionHealth({ state: 'CONNECTED', lastHealthCheckAt: new Date(now - 60_000).toISOString() }, now), 'VERIFIED');
  assert.equal(getMailConnectionHealth({ state: 'CONNECTED', lastHealthCheckAt: new Date(now - 25 * 60 * 60 * 1000).toISOString() }, now), 'DEGRADED');
});

test('accepts only an explicit native Safari extension state', () => {
  assert.equal(parseSafariExtensionState({ available: true, enabled: true }), 'ENABLED');
  assert.equal(parseSafariExtensionState({ available: true, enabled: false }), 'DISABLED');
  assert.equal(parseSafariExtensionState({ available: false, enabled: true }), 'UNAVAILABLE');
  assert.equal(parseSafariExtensionState({ enabled: true }), 'UNAVAILABLE');
  assert.equal(parseSafariExtensionState(null), 'UNAVAILABLE');
});
