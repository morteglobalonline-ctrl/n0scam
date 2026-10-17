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

const reportKindLabel: Record<HistoryKind, string> = { LINK: 'Link', QR: 'QR', MESSAGE: 'Mesaj', EMAIL: 'E-posta' };
const reportVerdictLabel: Record<HistoryRecord['verdict'], string> = { BLOCK: 'Yüksek risk', WARN: 'Dikkat', UNKNOWN: 'Doğrulanamadı' };

export function buildShareableHistoryReport(records: readonly HistoryRecord[], filterLabel = 'Tümü') {
  const rows = records.map((record) => {
    const timestamp = new Date(record.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
    return `• ${timestamp} · ${reportKindLabel[record.kind]} · ${record.label} · ${reportVerdictLabel[record.verdict]} · ${record.evidenceCount} işaret`;
  });
  return [
    'n0scam geçmiş özeti',
    `Filtre: ${filterLabel}`,
    `Kayıt sayısı: ${records.length}`,
    '',
    ...rows,
    '',
    'Ham mesajlar, tam bağlantılar ve QR yükleri bu özete eklenmemiştir.',
    'Sonuçlar analitiktir, tavsiye değildir.',
  ].join('\n');
}
