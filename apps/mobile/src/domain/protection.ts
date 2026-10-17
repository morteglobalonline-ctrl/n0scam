export type ProtectionModule = {
  id: string;
  name: string;
  summary: string;
  state: 'NOT_CONFIGURED' | 'PERMISSION_REQUIRED' | 'NOT_SUPPORTED';
  coverage: string;
  setupSteps?: readonly string[];
};

export const protectionModules: ProtectionModule[] = [
  { id: 'gmail', name: 'Gmail Koruması', summary: 'OAuth ve backend health-check gerektirir.', state: 'NOT_CONFIGURED', coverage: 'Bağlı posta kutusu bulunmuyor.' },
  { id: 'outlook', name: 'Outlook Koruması', summary: 'Microsoft Graph bağlantısı gerektirir.', state: 'NOT_CONFIGURED', coverage: 'Bağlı posta kutusu bulunmuyor.' },
  {
    id: 'safari',
    name: 'Safari Koruması',
    summary: 'Safari Web Extension hedefi uygulamaya gömülü; imzalı fiziksel-iPhone kabul testi bekliyor.',
    state: 'NOT_CONFIGURED',
    coverage: 'Uzantı yalnızca siz açtığınızda aktif sekmenin adresini cihaz üzerinde inceler. Kalıcı site erişimi, otomatik yönlendirme veya arka planda gezinme takibi yapmaz.',
    setupSteps: [
      'İmzalı geliştirme sürümünü fiziksel iPhone’a kurun.',
      'Ayarlar’da Safari > Uzantılar bölümünden n0scam Safari Koruması’nı açın.',
      'Safari araç çubuğundan uzantıyı çalıştırıp test adresinde sonucu doğrulayın.',
    ],
  },
  {
    id: 'chrome',
    name: 'Chrome Koruması',
    summary: 'iOS Share Extension hedefi uygulamaya gömülü; imzalı fiziksel-iPhone kabul testi bekliyor.',
    state: 'NOT_CONFIGURED',
    coverage: 'Chrome veya başka bir iOS uygulamasındaki bağlantı ve düz metin, yalnızca siz paylaşım menüsünden “n0scam ile İncele”yi seçip Analiz Et’e dokunduğunuzda cihazda değerlendirilir.',
    setupSteps: [
      'İmzalı geliştirme sürümünü fiziksel iPhone’a kurun.',
      'Chrome’da bir bağlantının Paylaş menüsünü açıp “n0scam ile İncele”yi seçin.',
      'Analiz Et’e dokunup hem riskli hem meşru örneklerde sonucu ve son çalışma sinyalini doğrulayın.',
    ],
  },
  {
    id: 'sms',
    name: 'Mesaj Koruması',
    summary: 'IdentityLookup Message Filter hedefi uygulamaya gömülü; imzalı fiziksel-iPhone kabul testi bekliyor.',
    state: 'NOT_CONFIGURED',
    coverage: 'Yalnızca iOS’un bilinmeyen gönderici olarak sunduğu SMS/MMS metni cihaz üzerinde değerlendirilir. İçerik loglanmaz, saklanmaz veya sunucuya gönderilmez.',
    setupSteps: [
      'İmzalı geliştirme sürümünü fiziksel iPhone’a kurun.',
      'Ayarlar’da Mesajlar > Bilinmeyen ve İstenmeyen bölümünü açın.',
      'n0scam Mesaj Koruması’nı seçip yüksek riskli ve meşru test mesajlarıyla yanlış pozitif kontrolü yapın.',
    ],
  },
  { id: 'network', name: 'Ağ Koruması', summary: 'Apple entitlement ve cihaz PoC sonucu gerekli.', state: 'NOT_SUPPORTED', coverage: 'Bu sürümde ağ trafiği korunmuyor.' },
  { id: 'family', name: 'Aile Koruması', summary: 'Davet, izin ve ayrı kullanıcı oturumları henüz uygulanmadı.', state: 'NOT_CONFIGURED', coverage: 'Bu sürümde aile üyesi hesabı bağlı değil ve başka bir kullanıcının verisine erişilmiyor.' },
];

export const stateLabel = { NOT_CONFIGURED: 'Kurulum gerekli', PERMISSION_REQUIRED: 'İzin gerekli', NOT_SUPPORTED: 'Henüz desteklenmiyor' } as const;

const extensionHeartbeatFreshnessMs = 30 * 24 * 60 * 60 * 1000;

function parseExtensionHeartbeat(raw: string | null, now = Date.now()) {
  if (!raw) return null;
  const lastEvaluatedAt = Number(raw);
  if (!Number.isSafeInteger(lastEvaluatedAt) || lastEvaluatedAt <= 0 || lastEvaluatedAt > now + 5 * 60 * 1000) return null;
  return { lastEvaluatedAt, fresh: now - lastEvaluatedAt <= extensionHeartbeatFreshnessMs };
}

export function parseSmsHeartbeat(raw: string | null, now = Date.now()) { return parseExtensionHeartbeat(raw, now); }
export function parseShareHeartbeat(raw: string | null, now = Date.now()) { return parseExtensionHeartbeat(raw, now); }

type MailHealthStatus =
  | null
  | { state: 'DISCONNECTED' }
  | { state: 'CONNECTED' | 'DEGRADED'; lastHealthCheckAt: string | null };

const mailHealthFreshnessMs = 24 * 60 * 60 * 1000;

export function getMailConnectionHealth(status: MailHealthStatus, now = Date.now()) {
  if (!status || status.state === 'DISCONNECTED') return 'DISCONNECTED' as const;
  if (status.state === 'DEGRADED' || !status.lastHealthCheckAt) return 'DEGRADED' as const;
  const checkedAt = Date.parse(status.lastHealthCheckAt);
  if (!Number.isFinite(checkedAt) || checkedAt > now + 5 * 60 * 1000 || now - checkedAt > mailHealthFreshnessMs) return 'DEGRADED' as const;
  return 'VERIFIED' as const;
}

export function parseSafariExtensionState(value: unknown) {
  if (!value || typeof value !== 'object') return 'UNAVAILABLE' as const;
  const candidate = value as Record<string, unknown>;
  if (candidate.available !== true) return 'UNAVAILABLE' as const;
  return candidate.enabled === true ? 'ENABLED' as const : 'DISABLED' as const;
}
