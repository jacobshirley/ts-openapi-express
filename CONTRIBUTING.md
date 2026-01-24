# Contributing to ts-openapi-express

Thank you for contributing! This guide will help you maintain consistency with the project.

## Development

### Setup

```bash
pnpm install
```

### Commands

```bash
pnpm test           # Run all tests (generates types + runs vitest)
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
feat: add support for OpenAPI request validation
fix: correct type inference for path parameters
```

Valid types: `feat`, `fix`, `ci`, `chore`, `perf`, `docs`, `test`, `refactor`

## Code Standards

### File Naming

Use kebab-case for all files: `openapi-routes.ts`, `validation-middleware.ts`

### Documentation

Use JSDoc comments for public APIs:

```typescript
/**
 * Creates an Express application with OpenAPI validation.
 *
 * @param options - Configuration for the OpenAPI app
 * @returns An Express app with OpenAPI integration
 * @example
 * const app = openapiExpress<paths>({
 *   specPath: './openapi.yaml',
 *   routes: myRoutes
 * })
 */
export function openapiExpress<Spec>(options: OpenapiExpressOptions<Spec>) {
    // Implementation
}
```

### Testing

Tests use Vitest. When modifying OpenAPI specs, regenerate types:

```bash
npm run test:compile:spec  # Regenerates types from spec
npm run test:unit          # Runs tests
```

Test structure:

- `test/unit/` - Unit tests
- `test/unit/openapi.test.yaml` - Test OpenAPI spec
- `test/unit/test-schema.ts` - Auto-generated types

## Questions?

Open an issue for bugs or feature requests.
