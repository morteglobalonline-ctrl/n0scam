import assert from 'node:assert/strict';
import test from 'node:test';

import { ConnectorApiClient, ConnectorApiError } from './connector-api.ts';

test('does not start Gmail OAuth without a configured backend', async () => {
  const client = new ConnectorApiClient();
  await assert.rejects(() => client.getGmailStatus(), (error) => error instanceof ConnectorApiError && error.code === 'NOT_CONFIGURED');
});

test('does not crash construction for an invalid build-time endpoint', async () => {
  const client = new ConnectorApiClient({ baseUrl: 'http://public.example.com' });
  assert.equal(client.configured, false);
  await assert.rejects(() => client.getGmailStatus(), (error) => error instanceof ConnectorApiError && error.code === 'INVALID_CONFIGURATION');
});

test('accepts a bounded Gmail connection status', async () => {
  const fetchImpl = async () => new Response(JSON.stringify({ state: 'CONNECTED', accountLabel: 'm***@gmail.com', connectedAt: '2026-10-16T10:00:00Z', lastHealthCheckAt: '2026-10-16T10:01:00Z' }), { status: 200 });
  const client = new ConnectorApiClient({ baseUrl: 'https://api.example.com', fetchImpl });
  assert.equal((await client.getGmailStatus()).state, 'CONNECTED');
});

test('rejects a non-Google authorization destination', async () => {
  const fetchImpl = async () => new Response(JSON.stringify({ authorizationUrl: 'https://evil.example/oauth' }), { status: 200 });
  const client = new ConnectorApiClient({ baseUrl: 'https://api.example.com', fetchImpl });
  await assert.rejects(() => client.beginGmailConnection({ redirectUri: 'n0scam://oauth/gmail', codeChallenge: 'challenge', state: 'state', locale: 'tr-TR' }), (error) => error instanceof ConnectorApiError && error.code === 'INVALID_RESPONSE');
});

test('accepts only a Google authorization URL bound to this PKCE transaction', async () => {
  const request = { redirectUri: 'n0scam://oauth/gmail', codeChallenge: 'challenge', state: 'state', locale: 'tr-TR' };
  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorizationUrl.search = new URLSearchParams({ response_type: 'code', redirect_uri: request.redirectUri, state: request.state, code_challenge: request.codeChallenge, code_challenge_method: 'S256', client_id: 'ios-client' }).toString();
  const client = new ConnectorApiClient({ baseUrl: 'https://api.example.com', fetchImpl: async () => new Response(JSON.stringify({ authorizationUrl }), { status: 200 }) });
  assert.equal(await client.beginGmailConnection(request), authorizationUrl.href);

  authorizationUrl.searchParams.set('state', 'attacker-state');
  const mismatched = new ConnectorApiClient({ baseUrl: 'https://api.example.com', fetchImpl: async () => new Response(JSON.stringify({ authorizationUrl }), { status: 200 }) });
  await assert.rejects(() => mismatched.beginGmailConnection(request), (error) => error instanceof ConnectorApiError && error.code === 'INVALID_RESPONSE');
});

test('accepts only the Microsoft common v2 authorization endpoint for Outlook', async () => {
  const request = { redirectUri: 'n0scam://oauth/outlook', codeChallenge: 'challenge', state: 'state', locale: 'tr-TR' };
  const authorizationUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
  authorizationUrl.search = new URLSearchParams({ response_type: 'code', redirect_uri: request.redirectUri, state: request.state, code_challenge: request.codeChallenge, code_challenge_method: 'S256', client_id: 'entra-client' }).toString();
  const client = new ConnectorApiClient({ baseUrl: 'https://api.example.com', fetchImpl: async () => new Response(JSON.stringify({ authorizationUrl }), { status: 200 }) });
  assert.equal(await client.beginOutlookConnection(request), authorizationUrl.href);

  authorizationUrl.pathname = '/organizations/oauth2/v2.0/authorize';
  const wrongTenant = new ConnectorApiClient({ baseUrl: 'https://api.example.com', fetchImpl: async () => new Response(JSON.stringify({ authorizationUrl }), { status: 200 }) });
  await assert.rejects(() => wrongTenant.beginOutlookConnection(request), (error) => error instanceof ConnectorApiError && error.code === 'INVALID_RESPONSE');
});

test('completes Gmail OAuth only with a connected backend status', async () => {
  let receivedBody = '';
  const fetchImpl = async (_url, init) => { receivedBody = String(init?.body ?? ''); return new Response(JSON.stringify({ state: 'CONNECTED', accountLabel: 'm***@gmail.com', connectedAt: '2026-10-16T10:00:00Z', lastHealthCheckAt: null }), { status: 200 }); };
  const client = new ConnectorApiClient({ baseUrl: 'https://api.example.com', fetchImpl });
  const result = await client.completeGmailConnection({ redirectUri: 'n0scam://oauth/gmail', code: 'code', codeVerifier: 'verifier', state: 'state' });
  assert.equal(result.state, 'CONNECTED');
  assert.match(receivedBody, /"codeVerifier":"verifier"/);
});
