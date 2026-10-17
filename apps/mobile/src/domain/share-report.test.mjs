import assert from 'node:assert/strict';
import test from 'node:test';
import { buildShareableRiskReport } from './share-report.ts';

const base = {
  verdict: 'WARN',
  severity: 'MEDIUM',
  evidence: [{ title: 'Harici bağlantı', detail: 'Sabit açıklama' }],
  missingData: [],
  actions: ['Göndereni bağımsız doğrula'],
};

test('shares only the hostname for a URL assessment', () => {
  const report = buildShareableRiskReport({
    ...base,
    inputType: 'URL',
    displayValue: 'https://Example.com/private/path?token=super-secret',
  });
  assert.match(report, /İncelenen hedef: example\.com/);
  assert.doesNotMatch(report, /private|super-secret|token=/);
});

test('never includes raw message or non-web QR content', () => {
  const secret = 'OTP 123456 ve kart 4111111111111111';
  const messageReport = buildShareableRiskReport({ ...base, inputType: 'MESSAGE', displayValue: secret });
  const qrReport = buildShareableRiskReport({ ...base, inputType: 'QR', displayValue: secret });
  assert.doesNotMatch(messageReport, /123456|4111111111111111/);
  assert.doesNotMatch(qrReport, /123456|4111111111111111/);
  assert.match(messageReport, /İçerik gizlendi/);
  assert.match(qrReport, /İçerik gizlendi/);
});
