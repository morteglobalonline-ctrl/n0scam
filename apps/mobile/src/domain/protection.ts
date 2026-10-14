export type ProtectionModule = {
  id: string;
  name: string;
  summary: string;
  state: 'NOT_CONFIGURED' | 'PERMISSION_REQUIRED' | 'NOT_SUPPORTED';
  coverage: string;
};

export const protectionModules: ProtectionModule[] = [
  { id: 'safari', name: 'Safari Koruması', summary: 'Safari Web Extension fizibilite aşamasında.', state: 'NOT_CONFIGURED', coverage: 'Safari için henüz canlı koruma yok.' },
  { id: 'gmail', name: 'Gmail Koruması', summary: 'OAuth ve backend health-check gerektirir.', state: 'NOT_CONFIGURED', coverage: 'Bağlı posta kutusu bulunmuyor.' },
  { id: 'outlook', name: 'Outlook Koruması', summary: 'Microsoft Graph bağlantısı gerektirir.', state: 'NOT_CONFIGURED', coverage: 'Bağlı posta kutusu bulunmuyor.' },
  { id: 'sms', name: 'Mesaj Koruması', summary: 'iOS Message Filter Extension doğrulanmalı.', state: 'NOT_CONFIGURED', coverage: 'Mesajlar arka planda okunmuyor.' },
  { id: 'network', name: 'Ağ Koruması', summary: 'Apple entitlement ve cihaz PoC sonucu gerekli.', state: 'NOT_SUPPORTED', coverage: 'Bu sürümde ağ trafiği korunmuyor.' },
];

export const stateLabel = { NOT_CONFIGURED: 'Kurulum gerekli', PERMISSION_REQUIRED: 'İzin gerekli', NOT_SUPPORTED: 'Henüz desteklenmiyor' } as const;
