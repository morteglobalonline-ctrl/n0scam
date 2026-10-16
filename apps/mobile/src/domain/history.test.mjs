import assert from 'node:assert/strict';
import test from 'node:test';

import { historyKindForResult, historyLabel } from './history.ts';

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
