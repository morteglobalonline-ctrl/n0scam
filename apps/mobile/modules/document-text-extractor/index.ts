import { requireOptionalNativeModule } from 'expo-modules-core';

export type ExtractedText = {
  text: string;
  truncated: boolean;
  pageCount?: number;
};

type DocumentTextExtractorNativeModule = {
  recognizeImage(uri: string): Promise<ExtractedText>;
  extractFile(uri: string): Promise<ExtractedText>;
};

export default requireOptionalNativeModule<DocumentTextExtractorNativeModule>('DocumentTextExtractor');
