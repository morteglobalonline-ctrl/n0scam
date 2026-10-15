const suspiciousTlds = new Set(['zip', 'top', 'click', 'support', 'live', 'cam', 'xyz']);
const shortenerHosts = new Set(['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'rb.gy']);
const officialBrandHosts = {
  apple: ['apple.com'],
  paypal: ['paypal.com'],
  amazon: ['amazon.com', 'amazon.com.tr'],
  netflix: ['netflix.com'],
  instagram: ['instagram.com'],
};

function isHostOrSubdomain(host, domain) {
  return host === domain || host.endsWith(`.${domain}`);
}

export function classifyActiveUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return { supported: false, verdict: 'UNKNOWN', host: '', signals: ['Geçerli bir web adresi değil.'] };
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { supported: false, verdict: 'UNKNOWN', host: url.hostname, signals: ['Bu içerik web bağlantısı değil.'] };
  }

  const host = url.hostname.toLowerCase();
  const signals = [];
  let score = 0;
  if (url.protocol === 'http:') { score += 2; signals.push('Bağlantı HTTPS kullanmıyor.'); }
  if (url.username || url.password) { score += 3; signals.push('URL kullanıcı bilgisi bölümü içeriyor.'); }
  if (host.includes('xn--')) { score += 2; signals.push('Alan adı kodlanmış karakter içeriyor.'); }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) { score += 2; signals.push('Bağlantı doğrudan IP adresi kullanıyor.'); }
  const tld = host.split('.').at(-1) ?? '';
  if (suspiciousTlds.has(tld)) { score += 1; signals.push(`.${tld} uzantısı ek doğrulama gerektiriyor.`); }
  if ((host.match(/-/g) ?? []).length >= 3) { score += 1; signals.push('Alan adında alışılmadık sayıda tire var.'); }
  if (shortenerHosts.has(host)) { score += 2; signals.push('Kısaltılmış bağlantı gerçek hedefi gizliyor.'); }
  const imitatesBrand = Object.entries(officialBrandHosts).some(([brand, domains]) => host.includes(brand) && !domains.some((domain) => isHostOrSubdomain(host, domain)));
  if (imitatesBrand) {
    score += 2;
    signals.push('Alan adı marka taklidi ihtimali taşıyor.');
  } else if (host.includes('banka') || host.includes('bank')) {
    score += 1;
    signals.push('Alan adı finans kurumu taklidi ihtimali taşıyor.');
  }

  if (!signals.length) signals.push('Belirgin yerel sinyal bulunmadı; bu güvenli olduğu anlamına gelmez.');
  return {
    supported: true,
    verdict: score >= 4 ? 'BLOCK' : score >= 2 ? 'WARN' : 'UNKNOWN',
    host,
    signals,
  };
}
