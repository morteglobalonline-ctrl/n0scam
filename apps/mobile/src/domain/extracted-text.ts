export type ExtractedText = {
  text: string;
  truncated: boolean;
  pageCount?: number;
};

export class DocumentTextError extends Error {
  readonly code: 'UNAVAILABLE' | 'EXTRACTION_FAILED' | 'NO_TEXT';

  constructor(message: string, code: 'UNAVAILABLE' | 'EXTRACTION_FAILED' | 'NO_TEXT') {
    super(message);
    this.name = 'DocumentTextError';
    this.code = code;
  }
}

export function parseExtractedText(value: unknown): ExtractedText {
  if (!value || typeof value !== 'object') {
    throw new DocumentTextError('Metin çıkarma sonucu doğrulanamadı.', 'EXTRACTION_FAILED');
  }
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.text !== 'string' || typeof candidate.truncated !== 'boolean') {
    throw new DocumentTextError('Metin çıkarma sonucu doğrulanamadı.', 'EXTRACTION_FAILED');
  }
  const text = candidate.text.replaceAll('\0', '').slice(0, 5_000).trim();
  if (!text) throw new DocumentTextError('Seçilen içerikte okunabilir metin bulunamadı.', 'NO_TEXT');
  const pageCount = Number.isSafeInteger(candidate.pageCount) && Number(candidate.pageCount) > 0 && Number(candidate.pageCount) <= 100_000 ? Number(candidate.pageCount) : undefined;
  return { text, truncated: candidate.truncated || candidate.text.length > 5_000, pageCount };
}
