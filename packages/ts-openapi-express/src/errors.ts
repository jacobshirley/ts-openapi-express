import { error as openapiValidatorErrors } from 'express-openapi-validator'

export type OpenapiValidatorError =
    (typeof openapiValidatorErrors)[keyof typeof openapiValidatorErrors]

const isExpressOpenAPIValidatorError = (
    err: any,
): err is Error & {
    status: number
} => {
    for (const key in openapiValidatorErrors) {
        if (
            err instanceof
            openapiValidatorErrors[key as keyof typeof openapiValidatorErrors]
        ) {
            return true
        }
    }

    return false
}

class HttpError extends Error {
    public readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }

    type() {
        return this.constructor.name
    }
}

class UnauthorizedError extends HttpError {
    constructor() {
        super('Unauthorized', 401)
    }
}

class RequestBodyTooLargeError extends HttpError {
    constructor(maxSizeBytes: number) {
        super(
            'Request body too large. Max size: ' + maxSizeBytes + ' bytes',
            413,
        )
    }
}

class InvalidJsonError extends HttpError {
    public readonly jsonString: string
    constructor(jsonString: string) {
        super(`Invalid JSON: ${jsonString}`, 400)
        this.jsonString = jsonString
    }
}

export {
    isExpressOpenAPIValidatorError,
    HttpError,
    RequestBodyTooLargeError,
    InvalidJsonError,
    UnauthorizedError,
}
