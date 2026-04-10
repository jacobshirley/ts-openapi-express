import express, { Application } from 'express'
import {
    ExpressMiddleware,
    ExpressMiddlewareWithError,
    ExpressRequest,
    OpenapiApplication,
    Routes,
} from './types.js'
import { json } from './middleware/json.js'
import { requestResponseValidatorMiddleware } from './middleware/validation.js'
import { resolveFile } from './jsonPointer.js'
import { OpenapiSpec } from './openapi-types/index.js'
import { openapiRoutes } from './openapiRoutes.js'
import { HttpError } from './errors.js'

function openapiExpress<Spec>(options: {
    specPath: string
    routes: Routes<Spec>
    middleware?: ExpressMiddleware[]
    errorMiddleware?: ExpressMiddlewareWithError[]
    validateRequest?: boolean
    validateResponse?: boolean
    decodeJsonBody?: boolean
    app?: Application
    disableXPoweredBy?: boolean
    handleHttpErrors?: boolean
}): OpenapiApplication<Spec> {
    const {
        specPath,
        routes,
        decodeJsonBody = true,
        disableXPoweredBy = true,
        validateRequest = true,
        validateResponse = true,
        middleware = [],
        errorMiddleware = [],
        handleHttpErrors = true,
    } = options

    const spec = resolveFile<OpenapiSpec>(specPath, { resolveLocalRefs: false })
    const app = options.app || express()

    if (disableXPoweredBy) app.disable('x-powered-by')

    app.use('/openapi.json', (req, res) => {
        res.json(spec)
    })

    if (decodeJsonBody) {
        app.use(json())
    }

    if (validateRequest || validateResponse) {
        app.use(
            ...requestResponseValidatorMiddleware({
                spec,
                validation: {
                    requests: validateRequest,
                    responses: validateResponse,
                },
            }),
        )
    }

    for (const m of middleware) {
        app.use(m)
    }

    openapiRoutes(routes, app)

    for (const em of errorMiddleware) {
        app.use(
            async (
                err: Error,
                req: express.Request,
                res: express.Response,
                next: express.NextFunction,
            ) => {
                try {
                    return await em(err, req, res, next)
                } catch (error) {
                    next(error)
                }
            },
        )
    }

    if (handleHttpErrors) {
        app.use(
            (
                err: Error,
                _: express.Request,
                res: express.Response,
                next: express.NextFunction,
            ) => {
                if (err instanceof HttpError) {
                    const status = err.status
                    const message = err.message || 'Error'

                    res.status(status).json({
                        error: {
                            message,
                            status,
                        },
                    })
                } else {
                    next(err)
                }
            },
        )
    }

    return Object.assign(app, {
        version: spec.info.version,
        openApiPath: specPath,
        spec,
        routes: routes,
    })
}

export { openapiExpress }
