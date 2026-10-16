export type MailConnectionStatus =
  | { state: 'DISCONNECTED' }
  | { state: 'CONNECTED' | 'DEGRADED'; accountLabel: string; connectedAt: string; lastHealthCheckAt: string | null };

export type GmailConnectionStatus = MailConnectionStatus;
export type OutlookConnectionStatus = MailConnectionStatus;
export type MailProvider = 'gmail' | 'outlook';

export type BeginMailConnectionRequest = {
  redirectUri: string;
  codeChallenge: string;
  state: string;
  locale: string;
};

export type CompleteMailConnectionRequest = {
  redirectUri: string;
  code: string;
  codeVerifier: string;
  state: string;
};

export type ConnectorApiErrorCode = 'NOT_CONFIGURED' | 'INVALID_CONFIGURATION' | 'TIMEOUT' | 'NETWORK' | 'HTTP' | 'INVALID_RESPONSE';

export class ConnectorApiError extends Error {
  readonly code: ConnectorApiErrorCode;
  readonly status: number | null;

  constructor(message: string, code: ConnectorApiErrorCode, status: number | null = null) {
    super(message);
    this.name = 'ConnectorApiError';
    this.code = code;
    this.status = status;
  }
}

type ConnectorApiClientOptions = { baseUrl?: string; fetchImpl?: typeof fetch; timeoutMs?: number };

function resolveBaseUrl(baseUrl?: string) {
  const configured = baseUrl?.trim();
  if (!configured) return null;
  let parsed: URL;
  try { parsed = new URL(configured); } catch { throw new ConnectorApiError('Bağlantı servisi adresi geçerli değil.', 'INVALID_CONFIGURATION'); }
  const local = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && local)) throw new ConnectorApiError('Bağlantı servisi üretimde HTTPS kullanmalıdır.', 'INVALID_CONFIGURATION');
  return parsed.href.endsWith('/') ? parsed.href : `${parsed.href}/`;
}

function isIsoDate(value: unknown) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function parseStatus(value: unknown): MailConnectionStatus | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.state === 'DISCONNECTED') return { state: 'DISCONNECTED' };
  if ((candidate.state === 'CONNECTED' || candidate.state === 'DEGRADED') && typeof candidate.accountLabel === 'string' && candidate.accountLabel.length > 0 && candidate.accountLabel.length <= 160 && isIsoDate(candidate.connectedAt) && (candidate.lastHealthCheckAt === null || isIsoDate(candidate.lastHealthCheckAt))) {
    return { state: candidate.state, accountLabel: candidate.accountLabel, connectedAt: candidate.connectedAt as string, lastHealthCheckAt: candidate.lastHealthCheckAt as string | null };
  }
  return null;
}

export class ConnectorApiClient {
  private readonly baseUrl: string | null;
  private readonly configurationError: ConnectorApiError | null;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: ConnectorApiClientOptions = {}) {
    let baseUrl: string | null = null;
    let configurationError: ConnectorApiError | null = null;
    try { baseUrl = resolveBaseUrl(options.baseUrl); }
    catch (cause) { configurationError = cause instanceof ConnectorApiError ? cause : new ConnectorApiError('Bağlantı servisi yapılandırması okunamadı.', 'INVALID_CONFIGURATION'); }
    this.baseUrl = baseUrl;
    this.configurationError = configurationError;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 10_000;
  }

  get configured() { return this.baseUrl !== null && this.configurationError === null; }

  private async request(path: string, init: RequestInit, signal?: AbortSignal) {
    if (this.configurationError) throw this.configurationError;
    if (!this.baseUrl) throw new ConnectorApiError('Gmail bağlantı servisi henüz yapılandırılmadı.', 'NOT_CONFIGURED');
    const controller = new AbortController();
    const relayAbort = () => controller.abort();
    signal?.addEventListener('abort', relayAbort, { once: true });
    if (signal?.aborted) controller.abort();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetchImpl(new URL(path, this.baseUrl), {
        ...init,
        credentials: 'include',
        headers: { Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
        signal: controller.signal,
      });
      if (!response.ok) throw new ConnectorApiError('E-posta bağlantı servisi isteği reddetti.', 'HTTP', response.status);
      const raw = await response.text();
      if (raw.length > 64_000) throw new ConnectorApiError('E-posta bağlantı yanıtı beklenenden büyük.', 'INVALID_RESPONSE');
      try { return raw ? JSON.parse(raw) as unknown : null; } catch { throw new ConnectorApiError('E-posta bağlantı yanıtı okunamadı.', 'INVALID_RESPONSE'); }
    } catch (cause) {
      if (cause instanceof ConnectorApiError) throw cause;
      if (controller.signal.aborted) throw new ConnectorApiError('Gmail bağlantı isteği zaman aşımına uğradı.', 'TIMEOUT');
      throw new ConnectorApiError('E-posta bağlantı servisine ulaşılamadı.', 'NETWORK');
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', relayAbort);
    }
  }

  private async getMailStatus(provider: MailProvider, signal?: AbortSignal) {
    const parsed = parseStatus(await this.request(`v1/connectors/${provider}/status`, { method: 'GET' }, signal));
    if (!parsed) throw new ConnectorApiError('E-posta durum yanıtı beklenen sözleşmeyle eşleşmiyor.', 'INVALID_RESPONSE');
    return parsed;
  }

  private async beginMailConnection(provider: MailProvider, request: BeginMailConnectionRequest, signal?: AbortSignal) {
    const value = await this.request(`v1/connectors/${provider}/authorize`, { method: 'POST', body: JSON.stringify(request) }, signal);
    const authorizationUrl = value && typeof value === 'object' ? (value as Record<string, unknown>).authorizationUrl : null;
    if (typeof authorizationUrl !== 'string' || authorizationUrl.length > 8_192) throw new ConnectorApiError('E-posta yetkilendirme yanıtı geçersiz.', 'INVALID_RESPONSE');
    let parsed: URL;
    try { parsed = new URL(authorizationUrl); } catch { throw new ConnectorApiError('E-posta yetkilendirme adresi geçersiz.', 'INVALID_RESPONSE'); }
    const oauthParamsMatch = parsed.searchParams.get('response_type') === 'code'
      && parsed.searchParams.get('redirect_uri') === request.redirectUri
      && parsed.searchParams.get('state') === request.state
      && parsed.searchParams.get('code_challenge') === request.codeChallenge
      && parsed.searchParams.get('code_challenge_method') === 'S256'
      && Boolean(parsed.searchParams.get('client_id'));
    const destinationMatches = provider === 'gmail'
      ? parsed.hostname === 'accounts.google.com' && parsed.pathname === '/o/oauth2/v2/auth'
      : parsed.hostname === 'login.microsoftonline.com' && parsed.pathname === '/common/oauth2/v2.0/authorize';
    if (parsed.protocol !== 'https:' || !destinationMatches || !oauthParamsMatch) throw new ConnectorApiError('E-posta yetkilendirme adresi güvenlik sözleşmesiyle eşleşmiyor.', 'INVALID_RESPONSE');
    return authorizationUrl;
  }

  private async completeMailConnection(provider: MailProvider, request: CompleteMailConnectionRequest, signal?: AbortSignal) {
    const parsed = parseStatus(await this.request(`v1/connectors/${provider}/complete`, { method: 'POST', body: JSON.stringify(request) }, signal));
    if (!parsed || parsed.state === 'DISCONNECTED') throw new ConnectorApiError('E-posta bağlantı sonucu doğrulanamadı.', 'INVALID_RESPONSE');
    return parsed;
  }

  private async disconnectMail(provider: MailProvider, signal?: AbortSignal) {
    await this.request(`v1/connectors/${provider}`, { method: 'DELETE' }, signal);
  }

  getGmailStatus(signal?: AbortSignal) { return this.getMailStatus('gmail', signal); }
  beginGmailConnection(request: BeginMailConnectionRequest, signal?: AbortSignal) { return this.beginMailConnection('gmail', request, signal); }
  completeGmailConnection(request: CompleteMailConnectionRequest, signal?: AbortSignal) { return this.completeMailConnection('gmail', request, signal); }
  disconnectGmail(signal?: AbortSignal) { return this.disconnectMail('gmail', signal); }

  getOutlookStatus(signal?: AbortSignal) { return this.getMailStatus('outlook', signal); }
  beginOutlookConnection(request: BeginMailConnectionRequest, signal?: AbortSignal) { return this.beginMailConnection('outlook', request, signal); }
  completeOutlookConnection(request: CompleteMailConnectionRequest, signal?: AbortSignal) { return this.completeMailConnection('outlook', request, signal); }
  disconnectOutlook(signal?: AbortSignal) { return this.disconnectMail('outlook', signal); }
}

export const connectorApi = new ConnectorApiClient({ baseUrl: process.env.EXPO_PUBLIC_CONNECTOR_API_URL });
