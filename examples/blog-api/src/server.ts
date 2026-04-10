/**
 * Blog API Example
 *
 * This example demonstrates a simple blog API using ts-openapi-express.
 *
 * To run this example:
 * 1. Generate types: pnpm run generate:types
 * 2. Run: pnpm start
 * 3. Access the API at http://localhost:3000
 * 4. View the OpenAPI spec at http://localhost:3000/openapi.json
 */

import { openapiExpress } from 'ts-openapi-express'
import path from 'path'
import { fileURLToPath } from 'url'
import type { paths, components } from './openapi.types.gen.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// In-memory storage for demo purposes - just use the schema types directly
type StoredPost = components['schemas']['Post']
type StoredComment = components['schemas']['Comment']

const posts: StoredPost[] = [
    {
        id: '1',
        title: 'Getting Started with TypeScript',
        content: 'TypeScript is a powerful language...',
        author: 'Alice',
        createdAt: new Date('2024-01-01').toISOString(),
    },
]

const comments: StoredComment[] = [
    {
        id: '1',
        postId: '1',
        text: 'Great article!',
        author: 'Bob',
        createdAt: new Date('2024-01-02').toISOString(),
    },
]

// Create the API application with type-safe routes
const app = openapiExpress<paths>({
    specPath: path.join(__dirname, '..', 'openapi.yaml'),
    validateRequest: true,
    validateResponse: true,
    routes: {
        '/posts': {
            get: {
                handler: async (req) => {
                    const limit = parseInt(String(req.query?.limit ?? 10))
                    const offset = parseInt(String(req.query?.offset ?? 0))

                    return {
                        200: {
                            headers: {},
                            body: posts.slice(offset, offset + limit),
                        },
                    }
                },
            },
            post: {
                handler: async (req) => {
                    const body = req.body
                    const newPost: StoredPost = {
                        id: String(Date.now()),
                        title: body.title,
                        content: body.content,
                        author: body.author,
                        createdAt: new Date().toISOString(),
                    }

                    posts.push(newPost)

                    return {
                        201: {
                            headers: {},
                            body: newPost,
                        },
                    }
                },
            },
        },
        '/posts/{postId}': {
            get: {
                handler: async (req) => {
                    const postId = req.params.postId

                    const post = posts.find((p) => p.id === postId)

                    if (!post) {
                        return {
                            404: {
                                headers: {},
                            },
                        }
                    }

                    return {
                        200: {
                            headers: {},
                            body: post,
                        },
                    }
                },
            },
            put: {
                handler: async (req) => {
                    const postId = req.params.postId
                    const body = req.body

                    const post = posts.find((p) => p.id === postId)

                    if (!post) {
                        return {
                            404: {
                                headers: {},
                            },
                        }
                    }

                    if (body.title) {
                        post.title = body.title
                    }
                    if (body.content) {
                        post.content = body.content
                    }
                    post.updatedAt = new Date().toISOString()

                    return {
                        200: {
                            headers: {},
                            body: post,
                        },
                    }
                },
            },
        },
        '/posts/{postId}/comments': {
            get: {
                handler: async (req) => {
                    const postId = req.params.postId

                    const postComments = comments.filter(
                        (c) => c.postId === postId,
                    )

                    return {
                        200: {
                            headers: {},
                            body: postComments,
                        },
                    }
                },
            },
            post: {
                handler: async (req) => {
                    const postId = req.params.postId
                    const body = req.body

                    // Verify post exists
                    const post = posts.find((p) => p.id === postId)
                    if (!post) {
                        return {
                            404: {
                                headers: {},
                            },
                        }
                    }

                    const newComment: StoredComment = {
                        id: String(Date.now()),
                        postId,
                        text: body.text,
                        author: body.author,
                        createdAt: new Date().toISOString(),
                    }

                    comments.push(newComment)

                    return {
                        201: {
                            headers: {},
                            body: newComment,
                        },
                    }
                },
            },
        },
    },
})

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Blog API running on http://localhost:${PORT}`)
    console.log(
        `OpenAPI spec available at http://localhost:${PORT}/openapi.json`,
    )
})
