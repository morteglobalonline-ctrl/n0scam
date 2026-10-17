import DocumentTextExtractor, { type ExtractedText } from '../../modules/document-text-extractor';
import { DocumentTextError, parseExtractedText } from '@/domain/extracted-text';

async function run(extract: (() => Promise<ExtractedText>) | undefined) {
  if (!extract) throw new DocumentTextError('Cihaz üzerinde metin çıkarma bu platformda kullanılamıyor.', 'UNAVAILABLE');
  try { return parseExtractedText(await extract()); }
  catch (cause) {
    if (cause instanceof DocumentTextError) throw cause;
    throw new DocumentTextError(cause instanceof Error ? cause.message : 'Metin çıkarılamadı.', 'EXTRACTION_FAILED');
  }
}

export function recognizeImageText(uri: string) {
  const extractor = DocumentTextExtractor;
  return run(extractor ? () => extractor.recognizeImage(uri) : undefined);
}

export function extractDocumentText(uri: string) {
  const extractor = DocumentTextExtractor;
  return run(extractor ? () => extractor.extractFile(uri) : undefined);
}

export { DocumentTextError, parseExtractedText } from '@/domain/extracted-text';
