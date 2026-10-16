import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { connectorApi, ConnectorApiError, type GmailConnectionStatus } from '@/services/connector-api';

export type GmailOAuthResult = { type: 'canceled' } | { type: 'connected'; status: GmailConnectionStatus };

function base64Url(value: string) {
  return value.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function assertCallback(urlValue: string, redirectUri: string, expectedState: string) {
  const callback = new URL(urlValue);
  const expected = new URL(redirectUri);
  if (callback.protocol !== expected.protocol || callback.hostname !== expected.hostname || callback.pathname !== expected.pathname) throw new ConnectorApiError('Gmail dönüş adresi doğrulanamadı.', 'INVALID_RESPONSE');
  if (callback.searchParams.get('state') !== expectedState) throw new ConnectorApiError('Gmail güvenlik durumu eşleşmedi.', 'INVALID_RESPONSE');
  const providerError = callback.searchParams.get('error');
  if (providerError) throw new ConnectorApiError('Gmail yetkilendirmesi tamamlanmadı.', 'HTTP');
  const code = callback.searchParams.get('code');
  if (!code || code.length > 4_096) throw new ConnectorApiError('Gmail yetkilendirme kodu alınamadı.', 'INVALID_RESPONSE');
  return code;
}

export async function connectGmail(): Promise<GmailOAuthResult> {
  const redirectUri = Linking.createURL('oauth/gmail');
  const codeVerifier = `${Crypto.randomUUID()}${Crypto.randomUUID()}${Crypto.randomUUID()}`.replace(/-/g, '');
  const codeChallenge = base64Url(await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, codeVerifier, { encoding: Crypto.CryptoEncoding.BASE64 }));
  const state = Crypto.randomUUID();
  const authorizationUrl = await connectorApi.beginGmailConnection({ redirectUri, codeChallenge, state, locale: 'tr-TR' });
  const result = await WebBrowser.openAuthSessionAsync(authorizationUrl, redirectUri, { preferEphemeralSession: true, preferUniversalLinks: false });
  if (result.type !== 'success') return { type: 'canceled' };
  const code = assertCallback(result.url, redirectUri, state);
  const status = await connectorApi.completeGmailConnection({ redirectUri, code, codeVerifier, state });
  return { type: 'connected', status };
}
