import assert from 'node:assert/strict';
import test from 'node:test';
import { RiskApiClient, RiskApiError } from './risk-api.ts';

const liveAssessment = {
  id: 'assessment-1',
  inputType: 'URL',
  displayValue: 'https://example.com/',
  verdict: 'UNKNOWN',
  severity: 'LOW',
  confidence: 'LOW',
  evidence: [{ code: 'NO_MATCH', title: 'Eşleşme yok', detail: 'Canlı kaynaklarda eşleşme bulunmadı.', source: 'THREAT_INTELLIGENCE' }],
  missingData: ['Yeterli geçmiş'],
  suggestedActions: ['Alan adını bağımsız doğrula'],
  engineVersion: 'test-1',
  analyzedAt: '2026-10-15T00:00:00.000Z',
  mode: 'LIVE',
};

test('does not send content when the live API is not configured', async () => {
  let requested = false;
  const client = new RiskApiClient({ fetchImpl: async () => { requested = true; return new Response(); } });
  await assert.rejects(
    client.analyze({ inputType: 'URL', value: 'https://example.com' }),
    (error) => error instanceof RiskApiError && error.code === 'NOT_CONFIGURED',
  );
  assert.equal(requested, false);
});

test('posts the versioned request and accepts a valid live assessment', async () => {
  let requestBody;
  const client = new RiskApiClient({
    baseUrl: 'https://risk.example.com/api/',
    fetchImpl: async (url, init) => {
      assert.equal(url, 'https://risk.example.com/api/v1/risk/analyze');
      requestBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify(liveAssessment), { status: 200 });
    },
  });

  const result = await client.analyze({ inputType: 'URL', value: ' https://example.com ' });
  assert.equal(result.mode, 'LIVE');
  assert.deepEqual(requestBody, { inputType: 'URL', value: 'https://example.com', contractVersion: 1 });
});

test('rejects an invalid response instead of presenting it as a risk result', async () => {
  const client = new RiskApiClient({
    baseUrl: 'https://risk.example.com',
    fetchImpl: async () => new Response(JSON.stringify({ verdict: 'ALLOW' }), { status: 200 }),
  });
  await assert.rejects(
    client.analyze({ inputType: 'URL', value: 'https://example.com' }),
    (error) => error instanceof RiskApiError && error.code === 'INVALID_RESPONSE',
  );
});

test('reports a timeout without leaking the submitted content', async () => {
  const client = new RiskApiClient({
    baseUrl: 'https://risk.example.com',
    timeoutMs: 5,
    fetchImpl: async (_url, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    }),
  });
  await assert.rejects(
    client.analyze({ inputType: 'MESSAGE', value: 'Bu içerik hata metninde görünmemeli.' }),
    (error) => error instanceof RiskApiError && error.code === 'TIMEOUT' && !error.message.includes('Bu içerik'),
  );
});
