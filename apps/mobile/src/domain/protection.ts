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
  { id: 'chrome', name: 'Chrome Koruması', summary: 'iOS tarayıcı kapsamı doğrulanmalı.', state: 'NOT_CONFIGURED', coverage: 'Chrome için henüz canlı koruma yok.' },
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
