# ts-openapi-express

A lightweight, type-safe Express.js integration library for OpenAPI specifications. This package enables you to build type-safe REST APIs with full request/response validation using OpenAPI schemas.

## Features

- **Type-Safe Routes**: Leverage TypeScript to ensure your route handlers match your OpenAPI spec
- **Request/Response Validation**: Built-in middleware to validate incoming requests and outgoing responses against your OpenAPI schema
- **OpenAPI Schema Support**: Load OpenAPI specifications (YAML/JSON) and use them to drive your API implementation
- **Zero Configuration**: Minimal setup required - just provide your spec and route handlers
- **Middleware Support**: Integrate custom Express middleware alongside OpenAPI validation
- **Streaming Support**: Handle streaming responses with native Node.js streams

## Getting Started

### 1. Generate TypeScript Types from Your OpenAPI Spec

The first step is to generate TypeScript type definitions from your OpenAPI specification using [openapi-typescript](https://openapi-ts.pages.dev/).

```bash
npm install --save-dev openapi-typescript
```

Add this script to your `package.json`:

```json
{
    "scripts": {
        "generate:types": "openapi-typescript path/to/your/openapi.yaml --output path/to/generated/types.ts"
    }
}
```

Then run it to generate the types:

```bash
npm run generate:types
```

This command generates a `types.ts` file with path types that look like:

```typescript
export interface paths {
    '/users': {
        get: {
            responses: {
                '200': {
                    content: {
                        'application/json': {
                            id: string
                            name: string
                        }
                    }
                }
            }
        }
    }
    // ... more paths
}
```

### 2. Install ts-openapi-express

```bash
npm install ts-openapi-express
```

### 3. Define Your Routes with Type Safety

```typescript
import { openapiExpress } from 'ts-openapi-express'
import { paths } from './generated/types' // Generated from step 1

const app = openapiExpress<paths>({
    specPath: './openapi.yaml',
    routes: {
        '/users': {
            get: {
                handler: async (req) => ({
                    200: {
                        headers: {},
                        body: [
                            { id: '1', name: 'John' },
                            { id: '2', name: 'Jane' },
                        ],
                    },
                }),
            },
            post: {
                handler: async (req) => ({
                    201: {
                        headers: { 'content-type': 'application/json' },
                        body: { id: '3', name: req.body.name },
                    },
                }),
            },
        },
        '/users/{id}': {
            get: {
                handler: async (req) => ({
                    200: {
                        headers: {},
                        body: { id: req.params.id, name: 'John' },
                    },
                }),
            },
        },
    },
})

app.listen(3000, () => {
    console.log('API running on http://localhost:3000')
    console.log('OpenAPI spec available at http://localhost:3000/openapi.json')
})
```

## API Options

```typescript
interface OpenapiExpressOptions<Spec> {
    /**
     * Path to your OpenAPI specification file (YAML or JSON)
     */
    specPath: string

    /**
     * Route handlers object mapping paths to HTTP method handlers
     */
    routes: Routes<Spec>

    /**
     * Optional Express middleware to use
     */
    middleware?: ExpressMiddleware[]

    /**
     * Enable request validation against OpenAPI spec (default: true)
     */
    validateRequest?: boolean

    /**
     * Enable response validation against OpenAPI spec (default: true)
     */
    validateResponse?: boolean

    /**
     * Automatically parse JSON request bodies (default: true)
     */
    decodeJsonBody?: boolean

    /**
     * Provide an existing Express app instance (optional)
     */
    app?: Application

    /**
     * Disable the 'X-Powered-By' header (default: true)
     */
    disableXPoweredBy?: boolean
}
```

## Handler Signature

Route handlers receive type-safe request objects with:

- `req.params`: Path parameters (fully typed)
- `req.query`: Query parameters (fully typed)
- `req.body`: Request body (fully typed)
- `req.headers`: HTTP headers

Handlers must return a response object with a single status code:

```typescript
{
  200: {
    headers: { 'content-type': 'application/json' },
    body: { /* response data */ }
  }
}
```

Or, if no body is required:

```typescript
{
  204: {
    headers: {}
  }
}
```

Streaming responses are supported by passing a Node.js `Readable`:

```typescript
{
  200: {
    headers: { 'content-type': 'text/csv' },
    body: fs.createReadStream('data.csv')
  }
}
```

## Examples

### Running the Test

This repository includes a comprehensive test suite that demonstrates usage. To run it:

```bash
# This will:
# 1. Generate types from the OpenAPI spec
# 2. Run the test suite with validation
npm test
```

The test file at `packages/ts-openapi-express/test/unit/openapi.test.ts` shows:

- Type-safe route definition
- Request/response validation
- Error handling
- Path parameter usage
- Query parameter handling

### Regenerating Test Types

If you modify the test OpenAPI spec, regenerate the types:

```bash
npm run test:compile:spec
```

## Architecture

The library works in three main steps:

1. **Type Generation** (via openapi-typescript): Convert your OpenAPI spec into TypeScript types
2. **Route Definition**: Define your Express handlers using the generated types
3. **Validation**: Automatic request/response validation ensures your implementation matches the spec

## License

MIT
