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
const brandWords = ['banka', 'bank', 'paypal', 'apple', 'netflix', 'amazon', 'instagram'];

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
  if (brandWords.some((brand) => host.includes(brand)) && !host.endsWith('apple.com') && !host.endsWith('amazon.com')) { score += 2; evidence.push({ title: 'Marka taklidi ihtimali', detail: 'Alan adı bir marka ifadesi kullanıyor; resmi alan adı bağımsız doğrulanmalı.' }); }
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
