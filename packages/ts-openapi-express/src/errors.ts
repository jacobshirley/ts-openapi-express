import { error as OpenapiValidationErrors } from 'express-openapi-validator'

class HttpError extends Error {
    public readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
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
    OpenapiValidationErrors,
    HttpError,
    RequestBodyTooLargeError,
    InvalidJsonError,
    UnauthorizedError,
}
