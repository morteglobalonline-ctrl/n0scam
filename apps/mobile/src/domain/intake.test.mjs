import assert from 'node:assert/strict';
import test from 'node:test';
import { hasTrustedIntakeSource, readInboundValue } from './intake.ts';

test('reads only the first route value and removes null bytes', () => {
  assert.equal(readInboundValue(['  https://example.com/\0path  ', 'ignored'], 4096), 'https://example.com/path');
});

test('caps inbound content before placing it in a form', () => {
  assert.equal(readInboundValue('123456', 4), '1234');
});

test('only marks known native extension sources as trusted intake labels', () => {
  assert.equal(hasTrustedIntakeSource('safari-extension'), true);
  assert.equal(hasTrustedIntakeSource('share-extension'), true);
  assert.equal(hasTrustedIntakeSource('attacker-controlled'), false);
});
