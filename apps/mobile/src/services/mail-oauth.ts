import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { connectorApi, ConnectorApiError, type MailConnectionStatus, type MailProvider } from '@/services/connector-api';

export type MailOAuthResult = { type: 'canceled' } | { type: 'connected'; status: MailConnectionStatus };

function base64Url(value: string) {
  return value.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function assertCallback(urlValue: string, redirectUri: string, expectedState: string) {
  const callback = new URL(urlValue);
  const expected = new URL(redirectUri);
  if (callback.protocol !== expected.protocol || callback.hostname !== expected.hostname || callback.pathname !== expected.pathname) throw new ConnectorApiError('E-posta dönüş adresi doğrulanamadı.', 'INVALID_RESPONSE');
  if (callback.searchParams.get('state') !== expectedState) throw new ConnectorApiError('E-posta güvenlik durumu eşleşmedi.', 'INVALID_RESPONSE');
  const providerError = callback.searchParams.get('error');
  if (providerError) throw new ConnectorApiError('E-posta yetkilendirmesi tamamlanmadı.', 'HTTP');
  const code = callback.searchParams.get('code');
  if (!code || code.length > 4_096) throw new ConnectorApiError('E-posta yetkilendirme kodu alınamadı.', 'INVALID_RESPONSE');
  return code;
}

export async function connectMail(provider: MailProvider): Promise<MailOAuthResult> {
  const redirectUri = Linking.createURL(`oauth/${provider}`);
  const codeVerifier = `${Crypto.randomUUID()}${Crypto.randomUUID()}${Crypto.randomUUID()}`.replace(/-/g, '');
  const codeChallenge = base64Url(await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, codeVerifier, { encoding: Crypto.CryptoEncoding.BASE64 }));
  const state = Crypto.randomUUID();
  const request = { redirectUri, codeChallenge, state, locale: 'tr-TR' };
  const authorizationUrl = provider === 'gmail'
    ? await connectorApi.beginGmailConnection(request)
    : await connectorApi.beginOutlookConnection(request);
  const result = await WebBrowser.openAuthSessionAsync(authorizationUrl, redirectUri, { preferEphemeralSession: true, preferUniversalLinks: false });
  if (result.type !== 'success') return { type: 'canceled' };
  const code = assertCallback(result.url, redirectUri, state);
  const completeRequest = { redirectUri, code, codeVerifier, state };
  const status = provider === 'gmail'
    ? await connectorApi.completeGmailConnection(completeRequest)
    : await connectorApi.completeOutlookConnection(completeRequest);
  return { type: 'connected', status };
}
