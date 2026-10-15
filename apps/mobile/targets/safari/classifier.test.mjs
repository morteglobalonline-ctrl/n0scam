import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyActiveUrl } from './assets/classifier.js';

test('does not claim an ordinary HTTPS URL is safe', () => {
  const result = classifyActiveUrl('https://example.com/path');
  assert.equal(result.verdict, 'UNKNOWN');
  assert.match(result.signals[0], /güvenli olduğu anlamına gelmez/i);
});

test('flags a high-risk lookalike URL', () => {
  const result = classifyActiveUrl('http://paypal-login-account-check.top');
  assert.equal(result.verdict, 'BLOCK');
  assert.ok(result.signals.length >= 3);
});

test('rejects non-web schemes without executing them', () => {
  const result = classifyActiveUrl('javascript:alert(1)');
  assert.equal(result.supported, false);
  assert.equal(result.verdict, 'UNKNOWN');
});
