import {
    HttpMethod,
    GetStatusCodes,
    GetResponseHeaders,
    StandardHeaderMap,
} from './openapi-types/index.js'
import { Route, Routes, OpenapiRequest } from './types.js'
import { openapiPathToExpressPath } from './utils.js'
import { Application, Request, Response } from 'express'
import express from 'express'
import { Readable } from 'stream'

function assertHttpMethod(method: string): asserts method is HttpMethod {
    if (
        ![
            'get',
            'post',
            'put',
            'patch',
            'delete',
            'trace',
            'options',
            'connect',
        ].includes(method)
    ) {
        throw new Error(`Invalid HTTP method: ${method}`)
    }
}

function routeResponse<T>(route: Route<T>) {
    return async (request: Request, res: Response) => {
        const result = await route.handler(
            request as unknown as OpenapiRequest<T>,
        )

        const responseCodes = Object.keys(result).map(
            Number,
        ) as GetStatusCodes<T>[]

        if (responseCodes.length === 0) {
            throw new Error('No response code defined')
        }

        if (responseCodes.length > 1) {
            throw new Error('Multiple response codes defined')
        }

        const responseCode = responseCodes[0]

        if (!result[responseCode]) {
            throw new Error(
                `No response defined for status code ${responseCode}`,
            )
        }

        for (const header in result[responseCode].headers) {
            res.set(
                String(header),
                String(
                    result[responseCode].headers[
                        header as keyof (
                            | GetResponseHeaders<T, typeof responseCode>
                            | StandardHeaderMap
                        )
                    ],
                ),
            )
        }

        res.status(responseCode)

        const body =
            'body' in result[responseCode]
                ? result[responseCode].body
                : undefined

        if (body === undefined) {
            res.end()
        } else if (body instanceof Readable) {
            body.pipe(res)
        } else if (body instanceof ReadableStream) {
            const reader = body.getReader()

            const read = async () => {
                const { done, value } = await reader.read()
                if (done) {
                    res.end()
                    return
                }

                res.write(value.toString())
                await read()
            }

            await read()
        } else if (typeof body === 'string') {
            res.send(body)
        } else if (
            typeof body === 'object' &&
            body !== null &&
            (Symbol.asyncIterator in body || Symbol.iterator in body)
        ) {
            if (Array.isArray(body)) {
                res.json(body)
                return
            }

            for await (const chunk of body) {
                res.write(chunk.toString())
            }
            res.end()
        } else {
            res.json(
                typeof body === 'object' && body && 'toJSON' in body
                    ? body.toJSON()
                    : body,
            )
        }
    }
}

function openapiRoutes<TPaths>(
    routes: Routes<TPaths>,
    app: Application = express(),
): Application {
    for (const path of Object.keys(routes) as Array<keyof TPaths>) {
        for (const method in routes[path]) {
            assertHttpMethod(method)

            const route = routes[path][method]
            const expressPath = openapiPathToExpressPath(String(path))

            app[method](expressPath, routeResponse(route as Route<any>))
        }
    }

    return app
}

export { openapiRoutes }
