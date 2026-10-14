import assert from 'node:assert/strict';
import test from 'node:test';

import { analyzeMessage, analyzeUrl, normalizeUrl } from './risk.ts';

test('normalizes a bare host to https', () => {
  assert.equal(normalizeUrl('example.com/path').toString(), 'https://example.com/path');
});

test('rejects non-web protocols', () => {
  assert.throws(() => normalizeUrl('javascript:alert(1)'), /http veya https/);
});

test('flags a suspicious bank-lookalike URL without claiming certainty', () => {
  const result = analyzeUrl('https://banka-dogrulama-login.top/giris');
  assert.equal(result.verdict, 'WARN');
  assert.ok(result.evidence.some((item) => item.title === 'Marka taklidi ihtimali'));
  assert.ok(result.missingData.includes('Canlı tehdit istihbaratı'));
});

test('does not claim an ordinary URL is safe without live intelligence', () => {
  assert.equal(analyzeUrl('https://example.com').verdict, 'UNKNOWN');
});

test('finds urgency, credentials, and payment pressure in a message', () => {
  const result = analyzeMessage('ACİL: Hesabınız kapanacak. Doğrulama kodunu gönderip IBAN üzerinden ödeme yapın.');
  assert.equal(result.verdict, 'BLOCK');
  assert.equal(result.severity, 'HIGH');
});
