import express, { Application } from 'express'
import {
    ExpressMiddleware,
    ExpressMiddlewareWithError,
    OpenapiApplication,
    Routes,
} from './types.js'
import { json } from './middleware/json.js'
import { requestResponseValidatorMiddleware } from './middleware/validation.js'
import { resolveFile } from './jsonPointer.js'
import { OpenapiSpec } from './openapi-types/index.js'
import { openapiRoutes } from './openapiRoutes.js'

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

    if (validateRequest || validateResponse)
        app.use(
            ...requestResponseValidatorMiddleware({
                spec,
                validation: {
                    requests: validateRequest,
                    responses: validateResponse,
                },
            }),
        )

    for (const m of middleware) {
        app.use(m)
    }

    openapiRoutes(routes, app)

    for (const em of errorMiddleware) {
        app.use(em)
    }

    return Object.assign(app, {
        version: spec.info.version,
        openApiPath: specPath,
        spec,
        routes: routes,
    })
}

export { openapiExpress }
