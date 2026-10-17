import assert from 'node:assert/strict';
import test from 'node:test';

import { buildShareableHistoryReport, historyKindForResult, historyLabel } from './history.ts';

test('stores only the hostname for a URL history label', () => {
  assert.equal(historyLabel('LINK', 'https://User:Secret@PayPal.com/account?otp=1234'), 'paypal.com');
});

test('does not persist raw message or non-URL QR content in labels', () => {
  assert.equal(historyLabel('MESSAGE', 'OTP kodunuz 123456'), 'Mesaj analizi');
  assert.equal(historyLabel('QR', 'WIFI:T:WPA;S:Private;P:Secret;;'), 'URL olmayan QR içeriği');
});

test('maps route kinds to supported history filters', () => {
  assert.equal(historyKindForResult('URL'), 'LINK');
  assert.equal(historyKindForResult('QR'), 'QR');
  assert.equal(historyKindForResult('MESSAGE'), 'MESSAGE');
  assert.equal(historyKindForResult('EMAIL'), 'EMAIL');
});

test('builds a privacy-safe history report from redacted records', () => {
  const report = buildShareableHistoryReport([{ id: 1, kind: 'MESSAGE', verdict: 'WARN', severity: 'MEDIUM', label: 'Mesaj analizi', evidenceCount: 2, createdAt: 1_700_000_000_000 }], 'Mesaj');
  assert.match(report, /Filtre: Mesaj/);
  assert.match(report, /Mesaj analizi/);
  assert.match(report, /Ham mesajlar, tam bağlantılar ve QR yükleri/);
});
