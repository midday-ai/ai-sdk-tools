# @ai-sdk-tools/ocr

Extract structured data from invoices and receipts using AI SDK with intelligent provider fallback.

## Features

- **Clean API** - Simple, intuitive interface
- **Multiple Providers** - Mistral OCR (primary) with Gemini fallback
- **PDF Support** - Direct PDF processing with fallback to OCR extraction
- **Quality Validation** - Automatic quality checks with intelligent fallback
- **Result Merging** - Combines results from multiple attempts for best accuracy
- **Retry Logic** - Automatic retries with exponential backoff (default: 3 retries)
- **Multiple Input Formats** - Buffer, base64, file path, URL, or File object

## Installation

```bash
npm install @ai-sdk-tools/ocr
# or
bun add @ai-sdk-tools/ocr
```

## Quick Start

```typescript
import { ocr } from '@ai-sdk-tools/ocr';

// Extract invoice data
const invoice = await ocr(imageBuffer, 'invoice');

// Extract receipt data
const receipt = await ocr(imageUrl, 'receipt');

// With custom schema
import { invoiceSchema } from '@ai-sdk-tools/ocr';
const customInvoice = await ocr(imageFile, invoiceSchema);
```

## API

### `ocr(input, typeOrSchema, options?)`

Extract structured data from a document.

**Parameters:**
- `input` - Buffer, string (base64/file path/URL), or File object
- `typeOrSchema` - `'invoice' | 'receipt'` or a Zod schema
- `options` - Optional configuration (see below)

**Returns:** Promise with extracted structured data

**Example:**
```typescript
const result = await ocr(imageBuffer, 'invoice', {
  providers: {
    mistral: { model: 'mistral-medium-latest' },
    gemini: { model: 'gemini-1.5-pro' }
  },
  retries: 3,
  timeout: 20000
});
```

## Options

All options are optional:

```typescript
{
  providers?: {
    mistral?: { model?: string, apiKey?: string },
    gemini?: { model?: string, apiKey?: string }
  },
  timeout?: number,
  retries?: number, // Default: 3
  qualityThreshold?: QualityThreshold
}
```

## Predefined Schemas

```typescript
import { invoiceSchema, receiptSchema } from '@ai-sdk-tools/ocr';
```

## Error Handling

```typescript
import { OCRError } from '@ai-sdk-tools/ocr';

try {
  const result = await ocr(image, 'invoice');
} catch (error) {
  if (error instanceof OCRError) {
    console.error('OCR failed:', error.message);
    console.error('Provider attempts:', error.attempts);
  }
}
```

## How It Works

1. **Primary Attempt**: Mistral OCR with direct PDF/image processing
2. **Quality Check**: Validates extracted data meets minimum standards
3. **Fallback**: If primary fails or quality is poor, tries Gemini OCR
4. **OCR Fallback**: If both vision models fail, extracts text and uses LLM
5. **Result Merging**: Combines results from multiple attempts for best accuracy

## License

MIT

