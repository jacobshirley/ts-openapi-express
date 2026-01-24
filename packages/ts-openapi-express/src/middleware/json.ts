import { InvalidJsonError, RequestBodyTooLargeError } from '../errors.js'
import { ExpressMiddleware } from '../types.js'

const DEFAULT_LIMIT_BYTES = 10 * 1024 * 1024

function json(options?: { limit?: number }): ExpressMiddleware {
    const limit = options?.limit ?? DEFAULT_LIMIT_BYTES

    return async function json(req, res, next) {
        const contentType = req.headers['content-type']

        if (contentType?.trim()?.includes('application/json')) {
            let body = ''

            for await (const chunk of req) {
                body += chunk.toString()

                if (body.length > limit) {
                    next(new RequestBodyTooLargeError(limit))
                    return
                }
            }

            req.bodyAsString = body

            try {
                req.body = JSON.parse(body)
            } catch (e) {
                next(new InvalidJsonError(body))
                return
            }
        }

        next()
    }
}

export { json }
