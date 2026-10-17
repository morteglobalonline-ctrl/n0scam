export type LocalEvidence = { title: string; detail: string };
export type LocalAssessment = {
  inputType: 'URL' | 'QR' | 'MESSAGE';
  displayValue: string;
  verdict: 'WARN' | 'BLOCK' | 'UNKNOWN';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence: LocalEvidence[];
  missingData: string[];
  actions: string[];
};

const suspiciousTlds = new Set(['zip', 'top', 'click', 'support', 'live', 'cam', 'xyz']);
const shortenerHosts = new Set(['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'rb.gy']);
const officialBrandHosts: Record<string, readonly string[]> = {
  apple: ['apple.com'],
  paypal: ['paypal.com'],
  amazon: ['amazon.com', 'amazon.com.tr'],
  netflix: ['netflix.com'],
  instagram: ['instagram.com'],
};

function isHostOrSubdomain(host: string, domain: string) {
  return host === domain || host.endsWith(`.${domain}`);
}

export function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error('Bir bağlantı girmen gerekiyor.');
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(candidate);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Yalnızca http veya https bağlantıları incelenebilir.');
  return url;
}

export function analyzeUrl(raw: string, inputType: 'URL' | 'QR' = 'URL'): LocalAssessment {
  const url = normalizeUrl(raw);
  const host = url.hostname.toLowerCase();
  const evidence: LocalEvidence[] = [];
  let score = 0;
  if (url.protocol === 'http:') { score += 2; evidence.push({ title: 'Şifrelenmemiş bağlantı', detail: 'Bağlantı HTTPS kullanmıyor.' }); }
  if (url.username || url.password) { score += 3; evidence.push({ title: 'Yanıltıcı kullanıcı bilgisi', detail: 'URL içinde kullanıcı adı veya parola bölümü bulunuyor.' }); }
  if (host.includes('xn--')) { score += 2; evidence.push({ title: 'Kodlanmış alan adı', detail: 'Alan adı uluslararası karakter kodlaması içeriyor; benzer harf saldırısı olabilir.' }); }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) { score += 2; evidence.push({ title: 'IP adresine doğrudan bağlantı', detail: 'Bağlantı bilinen bir alan adı yerine sayısal adres kullanıyor.' }); }
  const tld = host.split('.').at(-1) ?? '';
  if (suspiciousTlds.has(tld)) { score += 1; evidence.push({ title: 'Ek doğrulama gereken uzantı', detail: `.${tld} uzantısı tek başına kötü niyet kanıtı değildir, ancak dikkat gerektirir.` }); }
  if ((host.match(/-/g) ?? []).length >= 3) { score += 1; evidence.push({ title: 'Karmaşık alan adı', detail: 'Alan adında alışılmadık sayıda tire bulunuyor.' }); }
  if (shortenerHosts.has(host)) { score += 2; evidence.push({ title: 'Gizlenmiş hedef adres', detail: 'Kısaltılmış bağlantı gerçek hedef alan adını ilk bakışta göstermiyor.' }); }
  const imitatesBrand = Object.entries(officialBrandHosts).some(([brand, domains]) => host.includes(brand) && !domains.some((domain) => isHostOrSubdomain(host, domain)));
  if (imitatesBrand) { score += 2; evidence.push({ title: 'Marka taklidi ihtimali', detail: 'Alan adı bir marka ifadesi kullanıyor; resmi alan adı bağımsız doğrulanmalı.' }); }
  else if (host.includes('banka') || host.includes('bank')) { score += 1; evidence.push({ title: 'Marka taklidi ihtimali', detail: 'Alan adı finans kurumu çağrışımı yapıyor; resmi alan adı bağımsız doğrulanmalı.' }); }
  return {
    inputType,
    displayValue: url.toString(),
    verdict: score >= 4 ? 'BLOCK' : score >= 2 ? 'WARN' : 'UNKNOWN',
    severity: score >= 4 ? 'HIGH' : score >= 2 ? 'MEDIUM' : 'LOW',
    evidence: evidence.length ? evidence : [{ title: 'Belirgin yerel sinyal bulunmadı', detail: 'Bu, bağlantının güvenli olduğu anlamına gelmez.' }],
    missingData: ['Canlı tehdit istihbaratı', 'Yönlendirme zinciri', 'Alan adı yaşı ve itibar verisi'],
    actions: ['Alan adını resmi kaynaktan bağımsız doğrula', 'Şifre, kart veya doğrulama kodu paylaşma', 'Şüpheli ise bağlantıyı açma'],
  };
}

export function analyzeQrContent(raw: string): LocalAssessment {
  try { return analyzeUrl(raw, 'QR'); } catch { /* Continue with non-web QR classification. */ }
  const value = raw.trim().slice(0, 5_000);
  const upper = value.toUpperCase();
  const common = { inputType: 'QR' as const, displayValue: value, missingData: ['Kaynak kimliği', 'Hedef işlemin gerçek bağlamı'] };
  if (/^OTPAUTH:\/\//i.test(value)) return { ...common, verdict: 'WARN', severity: 'MEDIUM', evidence: [{ title: 'Kimlik doğrulama anahtarı', detail: 'QR içeriği bir doğrulayıcı hesabına gizli anahtar eklemeyi deneyebilir.' }], actions: ['Kodu yalnızca kurulumu sizin başlattığınız resmi hizmette kullanın', 'QR görüntüsünü veya anahtarı kimseyle paylaşmayın'] };
  if (upper.startsWith('WIFI:')) return { ...common, verdict: 'UNKNOWN', severity: 'LOW', evidence: [{ title: 'Wi-Fi yapılandırma kodu', detail: 'Kod bir ağ adı ve bağlantı ayarı içerebilir; ağa otomatik bağlanılmadı.' }], actions: ['Ağ adını ve sahibini bağımsız doğrulayın', 'Tanımadığınız bir ağa bağlanmayın'] };
  if (upper.startsWith('BEGIN:VCARD') || upper.startsWith('MECARD:')) return { ...common, verdict: 'UNKNOWN', severity: 'LOW', evidence: [{ title: 'Kişi kartı', detail: 'Kod kişi bilgileri içerebilir; rehbere otomatik eklenmedi.' }], actions: ['Ad, numara ve kuruluşu kaydetmeden önce doğrulayın', 'Beklenmeyen bağlantı veya not alanlarına dikkat edin'] };
  if (/^(MAILTO:|MATMSG:)/i.test(value)) return { ...common, verdict: 'UNKNOWN', severity: 'LOW', evidence: [{ title: 'E-posta eylemi', detail: 'Kod alıcı, konu veya hazır mesaj içerebilir; e-posta oluşturulmadı.' }], actions: ['Alıcı adresini bağımsız doğrulayın', 'Hazır metindeki ödeme veya bilgi taleplerini kontrol edin'] };
  if (/^(TEL:|SMS:|SMSTO:|MMSTO:)/i.test(value)) return { ...common, verdict: 'UNKNOWN', severity: 'LOW', evidence: [{ title: 'Arama veya mesaj eylemi', detail: 'Kod bir numara ve hazır mesaj içerebilir; arama veya gönderim başlatılmadı.' }], actions: ['Numarayı resmi kaynaktan doğrulayın', 'Doğrulama kodu veya ödeme bilgisi göndermeyin'] };
  if (/^(GEO:|BEGIN:VEVENT)/i.test(value)) return { ...common, verdict: 'UNKNOWN', severity: 'LOW', evidence: [{ title: 'Konum veya etkinlik içeriği', detail: 'Kod konum ya da takvim bilgisi içerebilir; başka uygulamaya aktarılmadı.' }], actions: ['Konumu veya daveti kaynağından doğrulayın', 'Beklenmeyen ekleri veya talimatları açmayın'] };
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return { ...common, verdict: 'WARN', severity: 'MEDIUM', evidence: [{ title: 'Özel uygulama bağlantısı', detail: 'Kod bir uygulama eylemi çalıştırabilecek web dışı şema içeriyor; eylem başlatılmadı.' }], actions: ['Şemanın hangi uygulamaya ait olduğunu doğrulayın', 'Kaynağını bilmiyorsanız içeriği çalıştırmayın'] };
  return { ...common, verdict: 'UNKNOWN', severity: 'LOW', evidence: [{ title: 'Düz metin QR içeriği', detail: 'Kod web bağlantısı olmayan metin içeriyor; metin başka uygulamaya aktarılmadı.' }], actions: ['Metindeki talebi kaynağından doğrulayın', 'Şifre, kart veya doğrulama kodu paylaşmayın'] };
}

export function analyzeMessage(raw: string): LocalAssessment {
  const text = raw.trim();
  if (text.length < 8) throw new Error('Analiz için daha uzun bir mesaj gir.');
  const evidence: LocalEvidence[] = [];
  const checks = [
    { re: /(hemen|acil|son şans|hesabınız.*(kapat|kapan))/i, title: 'Aciliyet baskısı', detail: 'Mesaj hızlı karar vermen için baskı kuruyor.' },
    { re: /(şifre|parola|doğrulama kodu|otp|kart numarası)/i, title: 'Hassas bilgi talebi', detail: 'Mesaj kimlik doğrulama veya ödeme bilgisi istiyor olabilir.' },
    { re: /(ödeme|iban|havale|kripto|cüzdan)/i, title: 'Ödeme yönlendirmesi', detail: 'Mesaj para transferi veya ödeme talebi içeriyor.' },
    { re: /https?:\/\//i, title: 'Harici bağlantı', detail: 'Mesaj bir web bağlantısı içeriyor; hedef ayrıca incelenmeli.' },
  ];
  for (const check of checks) if (check.re.test(text)) evidence.push({ title: check.title, detail: check.detail });
  const score = evidence.length;
  return { inputType: 'MESSAGE', displayValue: text, verdict: score >= 3 ? 'BLOCK' : score >= 1 ? 'WARN' : 'UNKNOWN', severity: score >= 3 ? 'HIGH' : score >= 1 ? 'MEDIUM' : 'LOW', evidence: evidence.length ? evidence : [{ title: 'Belirgin dil sinyali bulunmadı', detail: 'Gönderen ve bağlantı doğrulanmadan güvenli kabul edilemez.' }], missingData: ['Gönderen kimliği', 'Bağlantı itibarı', 'Mesajın tam bağlamı'], actions: ['Göndereni başka bir kanaldan doğrula', 'OTP veya şifre paylaşma', 'Ödeme talebini resmi kanaldan kontrol et'] };
}

export function extractWebLinks(raw: string, limit = 5) {
  if (!Number.isSafeInteger(limit) || limit <= 0) return [];
  const matches = raw.slice(0, 5_000).match(/https?:\/\/[^\s<>"']+/gi) ?? [];
  const links: { url: string; hostname: string }[] = [];
  const seen = new Set<string>();
  for (const match of matches) {
    const candidate = match.replace(/[),.;!?\]}]+$/g, '');
    if (!candidate || candidate.length > 2_048) continue;
    try {
      const parsed = new URL(candidate);
      if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname || seen.has(parsed.href)) continue;
      seen.add(parsed.href);
      links.push({ url: parsed.href, hostname: parsed.hostname.toLowerCase() });
      if (links.length >= limit) break;
    } catch {
      // Malformed candidates are ignored rather than opened or normalized.
    }
  }
  return links;
}
