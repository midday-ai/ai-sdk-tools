# @ai-sdk-tools/ocr

## 1.1.0

### Minor Changes

- Add new @ai-sdk-tools/ocr package for extracting structured data from invoices and receipts using AI SDK with intelligent provider fallback (Mistral → Gemini → OCR).

## 1.0.0

### Added

- Initial release
- Extract structured data from invoices and receipts using AI SDK
- Support for Mistral OCR (primary) and Gemini (fallback)
- PDF support with OCR text extraction fallback
- Quality validation with intelligent fallback
- Result merging from multiple provider attempts
- Retry logic with exponential backoff (default: 3 retries)
- Support for multiple input formats: Buffer, base64, file path, URL, File object
- Predefined schemas for invoices and receipts
- Custom schema support
