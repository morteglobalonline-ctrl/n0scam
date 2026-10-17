import assert from 'node:assert/strict';
import test from 'node:test';

import { analyzeMessage, analyzeUrl, extractWebLinks, normalizeUrl } from './risk.ts';

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

test('does not flag official brand domains or their real subdomains as impersonation', () => {
  for (const value of ['https://www.apple.com/tr/', 'https://www.paypal.com/signin', 'https://amazon.com.tr/']) {
    const result = analyzeUrl(value);
    assert.equal(result.evidence.some((item) => item.title === 'Marka taklidi ihtimali'), false);
  }
});

test('flags brand text outside the official domain boundary', () => {
  for (const value of ['https://evilapple.com', 'https://apple.com.evil.example', 'https://paypal-security.example']) {
    const result = analyzeUrl(value);
    assert.equal(result.evidence.some((item) => item.title === 'Marka taklidi ihtimali'), true);
  }
});

test('warns when a known shortener hides the destination', () => {
  const result = analyzeUrl('https://bit.ly/example');
  assert.equal(result.verdict, 'WARN');
  assert.ok(result.evidence.some((item) => item.title === 'Gizlenmiş hedef adres'));
});

test('finds urgency, credentials, and payment pressure in a message', () => {
  const result = analyzeMessage('ACİL: Hesabınız kapanacak. Doğrulama kodunu gönderip IBAN üzerinden ödeme yapın.');
  assert.equal(result.verdict, 'BLOCK');
  assert.equal(result.severity, 'HIGH');
});

test('extracts bounded unique web links without accepting other schemes', () => {
  const links = extractWebLinks('Bak: https://Example.com/login?x=1, tekrar https://Example.com/login?x=1. ara tel:+90555 veya file:///private. Son: http://test.example/path!');
  assert.deepEqual(links, [
    { url: 'https://example.com/login?x=1', hostname: 'example.com' },
    { url: 'http://test.example/path', hostname: 'test.example' },
  ]);
});

test('caps message link extraction before UI routing', () => {
  const raw = Array.from({ length: 8 }, (_, index) => `https://host${index}.example/path`).join(' ');
  assert.equal(extractWebLinks(raw).length, 5);
  assert.deepEqual(extractWebLinks(raw, 0), []);
});
