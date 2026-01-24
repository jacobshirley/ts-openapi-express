import type { OpenapiSpec } from '../openapi-types/index.js'
import { Request, Response, NextFunction } from 'express'
import { middleware as openapiExpressValidatorMiddleware } from 'express-openapi-validator'

// TODO: remove this when express-openapi-validator supports Express 5.x. See: https://github.com/cdimascio/express-openapi-validator/issues/969
// This is caused by a breaking change in Express 5.x, where query is immutable by default
function makeQueryWritable(req: Request, res: Response, next: NextFunction) {
    if (req.query)
        Object.defineProperty(req, 'query', {
            writable: true,
            value: { ...req.query },
        })

    next()
}

function makeQueryReadOnly(req: Request, res: Response, next: NextFunction) {
    if (req.query)
        Object.defineProperty(req, 'query', {
            writable: false,
            value: { ...req.query },
        })

    next()
}

function requestResponseValidatorMiddleware(options: {
    spec: OpenapiSpec
    validation?:
        | {
              requests?: boolean
              responses?: boolean
          }
        | false
}) {
    const { spec, validation } = options

    const middleware = openapiExpressValidatorMiddleware({
        apiSpec: spec as any,
        validateApiSpec: true,
        ignoreUndocumented: true,
        validateSecurity: false,
        validateRequests:
            validation === false
                ? false
                : validation?.requests === false
                  ? false
                  : true,
        validateResponses:
            validation === false
                ? false
                : validation?.responses === false
                  ? false
                  : true,
    })

    return [makeQueryWritable, middleware, makeQueryReadOnly]
}

export { requestResponseValidatorMiddleware }
