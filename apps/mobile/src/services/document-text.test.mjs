import assert from 'node:assert/strict';
import test from 'node:test';
import { DocumentTextError, parseExtractedText } from '../domain/extracted-text.ts';

test('accepts bounded native text extraction results', () => {
  assert.deepEqual(parseExtractedText({ text: '  ACIL OTP IBAN  ', truncated: false, pageCount: 2 }), {
    text: 'ACIL OTP IBAN',
    truncated: false,
    pageCount: 2,
  });
});

test('removes null bytes and caps extracted content before analysis', () => {
  const result = parseExtractedText({ text: `a\0${'b'.repeat(5_100)}`, truncated: false });
  assert.equal(result.text.includes('\0'), false);
  assert.equal(result.text.length, 5_000);
  assert.equal(result.truncated, true);
});

test('rejects empty or malformed extraction results', () => {
  assert.throws(() => parseExtractedText({ text: '', truncated: false }), (error) => error instanceof DocumentTextError && error.code === 'NO_TEXT');
  assert.throws(() => parseExtractedText({ text: 'hello', truncated: 'no' }), (error) => error instanceof DocumentTextError && error.code === 'EXTRACTION_FAILED');
  assert.throws(() => parseExtractedText(null), (error) => error instanceof DocumentTextError && error.code === 'EXTRACTION_FAILED');
});
