import type { LocalAssessment } from '@/domain/risk';

export type HistoryKind = 'LINK' | 'QR' | 'MESSAGE' | 'EMAIL';
export type HistoryRecord = {
  id: number;
  kind: HistoryKind;
  verdict: LocalAssessment['verdict'];
  severity: LocalAssessment['severity'];
  label: string;
  evidenceCount: number;
  createdAt: number;
};

export function historyLabel(kind: HistoryKind, rawValue: string) {
  if (kind === 'MESSAGE') return 'Mesaj analizi';
  if (kind === 'EMAIL') return 'E-posta analizi';

  try {
    const value = /^[a-z][a-z\d+.-]*:/i.test(rawValue.trim()) ? rawValue.trim() : `https://${rawValue.trim()}`;
    const url = new URL(value);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.hostname.toLocaleLowerCase('tr-TR').slice(0, 160);
  } catch {
    // Non-URL QR payloads are deliberately not persisted.
  }

  return kind === 'QR' ? 'URL olmayan QR içeriği' : 'Bağlantı analizi';
}

export function historyKindForResult(kind: string): HistoryKind {
  if (kind === 'QR') return 'QR';
  if (kind === 'MESSAGE') return 'MESSAGE';
  if (kind === 'EMAIL') return 'EMAIL';
  return 'LINK';
}
