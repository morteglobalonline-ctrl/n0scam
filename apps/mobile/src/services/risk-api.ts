import type { RiskAssessment } from '@n0scam/contracts';

export type RiskInputType = RiskAssessment['inputType'];

export type AnalyzeRiskRequest = {
  inputType: RiskInputType;
  value: string;
  locale?: string;
};

export type RiskApiErrorCode =
  | 'NOT_CONFIGURED'
  | 'INVALID_CONFIGURATION'
  | 'INVALID_INPUT'
  | 'ABORTED'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'HTTP'
  | 'INVALID_RESPONSE';

export class RiskApiError extends Error {
  readonly code: RiskApiErrorCode;
  readonly status: number | null;

  constructor(
    message: string,
    code: RiskApiErrorCode,
    status: number | null = null,
  ) {
    super(message);
    this.name = 'RiskApiError';
    this.code = code;
    this.status = status;
  }
}

type RiskApiClientOptions = {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

const inputLimits: Record<RiskInputType, number> = {
  URL: 4096,
  QR: 4096,
  MESSAGE: 5000,
  EMAIL: 10000,
  PAYMENT: 4096,
};

const verdicts = new Set(['ALLOW', 'WARN', 'BLOCK', 'UNKNOWN']);
const severities = new Set(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
const confidences = new Set(['LOW', 'MEDIUM', 'HIGH']);
const evidenceSources = new Set(['ON_DEVICE', 'THREAT_INTELLIGENCE', 'CONNECTOR', 'MODEL']);

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isRiskAssessment(value: unknown): value is RiskAssessment {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<RiskAssessment>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.displayValue === 'string' &&
    typeof candidate.engineVersion === 'string' &&
    typeof candidate.analyzedAt === 'string' &&
    candidate.mode === 'LIVE' &&
    typeof candidate.inputType === 'string' &&
    candidate.inputType in inputLimits &&
    typeof candidate.verdict === 'string' && verdicts.has(candidate.verdict) &&
    typeof candidate.severity === 'string' && severities.has(candidate.severity) &&
    typeof candidate.confidence === 'string' && confidences.has(candidate.confidence) &&
    Array.isArray(candidate.evidence) &&
    candidate.evidence.every((item) =>
      Boolean(item) &&
      typeof item.code === 'string' &&
      typeof item.title === 'string' &&
      typeof item.detail === 'string' &&
      evidenceSources.has(item.source),
    ) &&
    isStringArray(candidate.missingData) &&
    isStringArray(candidate.suggestedActions)
  );
}

function resolveEndpoint(baseUrl?: string) {
  const configured = baseUrl?.trim();
  if (!configured) return null;

  let parsed: URL;
  try {
    parsed = new URL(configured);
  } catch {
    throw new RiskApiError('Risk API adresi geçerli değil.', 'INVALID_CONFIGURATION');
  }

  const isLocalDevelopment = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && isLocalDevelopment)) {
    throw new RiskApiError('Risk API üretimde HTTPS kullanmalıdır.', 'INVALID_CONFIGURATION');
  }

  return new URL('v1/risk/analyze', parsed.href.endsWith('/') ? parsed : `${parsed.href}/`).toString();
}

function validateRequest(request: AnalyzeRiskRequest) {
  const value = request.value.trim();
  if (!value) throw new RiskApiError('Analiz edilecek içerik boş olamaz.', 'INVALID_INPUT');
  if (value.length > inputLimits[request.inputType]) {
    throw new RiskApiError('Analiz edilecek içerik izin verilen sınırı aşıyor.', 'INVALID_INPUT');
  }
  return { ...request, value };
}

export class RiskApiClient {
  private readonly endpoint: string | null;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: RiskApiClientOptions = {}) {
    this.endpoint = resolveEndpoint(options.baseUrl);
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 8000;
  }

  get configured() {
    return this.endpoint !== null;
  }

  async analyze(request: AnalyzeRiskRequest, signal?: AbortSignal): Promise<RiskAssessment> {
    if (!this.endpoint) {
      throw new RiskApiError('Canlı Risk API henüz yapılandırılmadı.', 'NOT_CONFIGURED');
    }

    const body = validateRequest(request);
    const controller = new AbortController();
    const abortFromCaller = () => controller.abort();
    signal?.addEventListener('abort', abortFromCaller, { once: true });
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(this.endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...body, contractVersion: 1 }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new RiskApiError('Canlı analiz servisi isteği reddetti.', 'HTTP', response.status);
      }

      const raw = await response.text();
      if (raw.length > 256_000) {
        throw new RiskApiError('Canlı analiz yanıtı beklenenden büyük.', 'INVALID_RESPONSE');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        throw new RiskApiError('Canlı analiz yanıtı okunamadı.', 'INVALID_RESPONSE');
      }

      if (!isRiskAssessment(parsed)) {
        throw new RiskApiError('Canlı analiz yanıtı beklenen sözleşmeyle eşleşmiyor.', 'INVALID_RESPONSE');
      }
      return parsed;
    } catch (cause) {
      if (cause instanceof RiskApiError) throw cause;
      if (controller.signal.aborted) {
        if (signal?.aborted) throw new RiskApiError('Canlı analiz iptal edildi.', 'ABORTED');
        throw new RiskApiError('Canlı analiz zaman aşımına uğradı.', 'TIMEOUT');
      }
      throw new RiskApiError('Canlı analiz servisine ulaşılamadı.', 'NETWORK');
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', abortFromCaller);
    }
  }
}

export const riskApi = new RiskApiClient({ baseUrl: process.env.EXPO_PUBLIC_RISK_API_URL });
