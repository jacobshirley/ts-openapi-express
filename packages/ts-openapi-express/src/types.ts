import type {
    Application,
    NextFunction,
    Request as ExpressRequest,
    Response as ExpressResponse,
} from 'express'
import {
    GetRequestBody,
    GetRequestHeaders,
    GetResponseBody,
    GetPathParameters,
    GetQueryParameters,
    GetResponseHeaders,
    GetStatusCodes,
    HttpMethod,
    OpenapiSpec,
    StandardHeaderMap,
    StandardRequestHeader,
} from './openapi-types/index.js'
import { Readable } from 'stream'

type OpenapiRequest<T> = Omit<
    ExpressRequest,
    'query' | 'params' | 'body' | 'header' | 'headers'
> & {
    query: GetQueryParameters<T>
    params: GetPathParameters<T>
    body: GetRequestBody<T>
    header: <const THeader extends keyof GetRequestHeaders<T>>(
        header: StandardRequestHeader | THeader,
    ) => GetRequestHeaders<T>[THeader]
    headers: StandardHeaderMap & GetRequestHeaders<T>
}

type OpenapiResponse<T, Code extends GetStatusCodes<T> = GetStatusCodes<T>> = {
    [code in NoInfer<Code>]?: {
        headers: GetResponseHeaders<T, code> & StandardHeaderMap
    } & (GetResponseBody<T, code> extends [undefined]
        ? {}
        : {
              body:
                  | GetResponseBody<T, code>
                  | {
                        toJSON(): GetResponseBody<T, code>
                    }
                  | Readable
                  | ReadableStream<{ toString(): string }>
                  | Iterable<{ toString(): string }>
                  | AsyncIterable<{ toString(): string }>
          })
}

type HandlerResult<Schema> =
    | Promise<OpenapiResponse<Schema>>
    | OpenapiResponse<Schema>

type Route<Schema> = {
    handler: (request: OpenapiRequest<Schema>) => HandlerResult<Schema>
    middleware?: ((request: OpenapiRequest<Schema>) => HandlerResult<Schema>)[]
}

type Routes<Paths> = {
    [Path in keyof Paths]: {
        [Method in Extract<keyof Paths[Path], HttpMethod> as [
            undefined,
        ] extends [Paths[Path][Method]]
            ? never
            : Method]: Route<Paths[Path][Method]>
    }
}

type OpenapiApplication<T> = Application & {
    version: string
    openApiPath: string
    routes: Routes<T>
    spec: OpenapiSpec
}

type ExpressMiddleware = (
    request: ExpressRequest,
    response: ExpressResponse,
    next: NextFunction,
) => void

type ExpressMiddlewareWithError = (
    error: any,
    request: ExpressRequest,
    response: ExpressResponse,
    next: NextFunction,
) => void

type ErrorResponse = {
    message: string
    detail: string
    path: string
    errorCode: string
}

declare global {
    namespace Express {
        interface Request {
            bodyAsString: string
        }
    }
}

export type {
    OpenapiApplication,
    OpenapiRequest,
    OpenapiResponse,
    OpenapiSpec,
    Route,
    Routes,
    HandlerResult,
    ExpressMiddleware,
    ExpressMiddlewareWithError,
    ErrorResponse,
    ExpressRequest,
    ExpressResponse,
}
