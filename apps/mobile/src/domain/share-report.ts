import type { LocalAssessment } from './risk';

const riskLabels: Record<LocalAssessment['verdict'], string> = {
  BLOCK: 'Yüksek risk',
  WARN: 'Dikkat gerekiyor',
  UNKNOWN: 'Doğrulanamadı',
};

const typeLabels: Record<LocalAssessment['inputType'], string> = {
  URL: 'Bağlantı',
  QR: 'QR kod',
  MESSAGE: 'Mesaj / e-posta',
};

function safeTargetLabel(assessment: LocalAssessment) {
  if (assessment.inputType === 'MESSAGE') return 'İçerik gizlendi';
  try {
    const url = new URL(assessment.displayValue);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'İçerik gizlendi';
    return url.hostname.toLowerCase();
  } catch {
    return 'İçerik gizlendi';
  }
}

export function buildShareableRiskReport(assessment: LocalAssessment) {
  const evidence = assessment.evidence.map((item) => `• ${item.title}`).join('\n');
  const actions = assessment.actions.map((item) => `• ${item}`).join('\n');
  return [
    'n0scam analiz özeti',
    '',
    `İçerik türü: ${typeLabels[assessment.inputType]}`,
    `Risk durumu: ${riskLabels[assessment.verdict]}`,
    `İncelenen hedef: ${safeTargetLabel(assessment)}`,
    '',
    'Tespit edilen işaretler:',
    evidence,
    '',
    'Önerilen adımlar:',
    actions,
    '',
    'Ham mesaj, tam bağlantı ve kişisel içerik bu özete eklenmemiştir.',
    'Sonuç analitiktir, tavsiye değildir.',
  ].join('\n');
}
