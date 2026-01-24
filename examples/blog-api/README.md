# Blog API Example

A complete, working example of a simple blog API with posts and comments using ts-openapi-express.

## Setup

### 1. Generate Types from the OpenAPI Spec

```bash
pnpm run generate:types
```

This runs `openapi-typescript openapi.yaml --output openapi.types.ts` to generate TypeScript types from the OpenAPI specification. The generated `openapi.types.ts` file is then imported in `server.ts` for full type safety.

### 2. Run the Server

```bash
pnpm start
```

The server will start on http://localhost:3000.

## Testing the API

### Quick Test with Script

Run the comprehensive test script that demonstrates all endpoints:

```bash
./test-api.sh
```

This script will:

- Get all posts (with and without pagination)
- Create a new post
- Update a post
- Get comments
- Add comments
- Test error handling (404s)
- View the OpenAPI spec

**Note**: Requires `jq` for JSON formatting. Install with `brew install jq` on macOS.

### Manual Testing with curl

### Get all posts

```bash
curl http://localhost:3000/posts
```

### Create a new post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is a great post!",
    "author": "John"
  }'
```

### Get a specific post

```bash
curl http://localhost:3000/posts/1
```

### Update a post

```bash
curl -X PUT http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content"
  }'
```

### Get comments for a post

```bash
curl http://localhost:3000/posts/1/comments
```

### Add a comment

```bash
curl -X POST http://localhost:3000/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I really liked this!",
    "author": "Jane"
  }'
```

### View the OpenAPI spec

```
http://localhost:3000/openapi.json
```

## Key Concepts Demonstrated

- **Type Generation**: Using openapi-typescript to generate types from the OpenAPI spec
- **Type-Safe Routes**: All route handlers are fully typed based on the generated types
- **Request Validation**: Incoming requests are automatically validated against the spec
- **Response Validation**: Outgoing responses are automatically validated against the spec
- **Path Parameters**: Using typed path parameters like `{postId}`
- **Query Parameters**: Handling optional query parameters (limit, offset)
- **HTTP Methods**: GET, POST, PUT operations
- **Status Codes**: Returning different status codes (200, 201, 404) for different scenarios
- **In-Memory Storage**: Using arrays to store data for demonstration

## Next Steps

Try modifying the example:

1. Add new endpoints to `openapi.yaml`
2. Run `pnpm run generate:types` to regenerate types
3. Implement handlers for the new endpoints in `server.ts`
4. TypeScript will catch any mismatches between your handlers and the spec
