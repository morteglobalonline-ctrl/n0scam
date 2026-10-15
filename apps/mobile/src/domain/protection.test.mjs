import assert from 'node:assert/strict';
import test from 'node:test';
import { protectionModules } from './protection.ts';

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
