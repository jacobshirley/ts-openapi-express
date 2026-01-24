# Contributing to PDF-Lite

Thank you for contributing to PDF-Lite! This guide will help you understand the project structure and maintain consistency.

## Project Structure

```
packages/ts-openapi-express/
├── src/
│   ├── core/       # PDF primitives (objects, parser, tokenizer, streams)
│   ├── pdf/        # High-level PDF document handling
│   ├── crypto/     # Encryption algorithms (RC4, AES)
│   ├── security/   # Security handlers
│   ├── signing/    # Digital signature support
│   ├── filters/    # Compression filters (Flate, LZW, etc.)
│   └── utils/      # Utility functions
├── test/
│   ├── unit/       # Unit tests
│   └── acceptance/ # Acceptance tests
examples/           # Numbered example scripts (001-create-pdf.ts, etc.)
```

## Development

### Setup

```bash
pnpm install
```

### Commands

```bash
pnpm test           # Run all tests
pnpm compile        # Compile TypeScript
pnpm format         # Format code with Prettier
```

### Making Changes

1. Create a branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Ensure tests pass: `pnpm test`
4. Format code: `pnpm format`
5. Check for TypeScript errors: `pnpm compile`
6. Submit a pull request

### Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add support for XYZ PDF feature
fix: correct parsing of encrypted streams
docs: update encryption examples
test: add tests for compression algorithms
refactor: simplify stream processing logic
```

Other valid types: `ci`, `chore`, `bump`, `perf`, `security`, `release`, `revert`, `style`

## Code Standards

### File Naming

Use kebab-case for all files: `pdf-dictionary.ts`, `pdf-stream.ts`

### Documentation

Use JSDoc comments for public APIs:

```typescript
/**
 * Encrypts a PDF stream using the specified algorithm.
 *
 * @param stream - The stream to encrypt
 * @param algorithm - The encryption algorithm to use
 * @returns The encrypted stream
 */
export function encryptStream(stream: PdfStream, algorithm: string): PdfStream {
    // Implementation
}
```

### Testing

Tests are located in `packages/ts-openapi-express/test/`:

- `unit/` - Unit tests for individual components
- `acceptance/` - Integration tests with real PDFs

Use Vitest for testing:

```typescript
import { describe, it, expect } from 'vitest'

describe('Component', () => {
    it('should do something', () => {
        expect(result).toBe(expected)
    })
})
```

## Getting Help

- **Issues**: Open an issue for bugs or feature requests
- **Examples**: Check the `examples/` folder for reference implementations

Thank you for contributing! 🎉
