import { OpenAPIV3 } from 'openapi-types'

type LowercaseKeys<T> = {
    [K in keyof T as K extends string ? Lowercase<K> : K]: T[K]
}
type HttpMethod =
    | 'post'
    | 'get'
    | 'put'
    | 'patch'
    | 'delete'
    | 'head'
    | 'options'
    | 'trace'
    | 'connect'
type OpenapiSpec = OpenAPIV3.Document

type GetQueryParameters<T> = T extends {
    parameters: {
        query?: any
    }
}
    ? T['parameters']['query']
    : never

type GetPathParameters<T> = T extends {
    parameters: {
        path: any
    }
}
    ? T['parameters']['path']
    : never

type GetRequestHeaders<T> = T extends {
    parameters: {
        header?: any
    }
}
    ? [T['parameters']['header']] extends [never | undefined]
        ? never
        : LowercaseKeys<T['parameters']['header']>
    : never

type GetRequestBody<T> = T extends {
    requestBody?: {
        content?: any
    }
}
    ? undefined extends T['requestBody']
        ?
              | NonNullable<T['requestBody']>['content'][keyof NonNullable<
                    T['requestBody']
                >['content']]
              | undefined
        : NonNullable<T['requestBody']>['content'][keyof NonNullable<
              T['requestBody']
          >['content']]
    : never

type GetStatusCodes<T> = T extends {
    responses: {
        [x: number]: any
    }
}
    ? Extract<keyof T['responses'], number>
    : never

type GetResponseBody<T, Code extends number = number> = T extends {
    responses: {
        [x in Code]: {
            content?: {
                [key: string]: any
            }
        }
    }
}
    ? T['responses'][Code]['content'][keyof T['responses'][Code]['content']]
    : never

type GetJsonBody<T, Code extends number = number> = T extends {
    responses: {
        [x in Code]: {
            content?: {
                'application/json': any
            }
        }
    }
}
    ? Extract<
          T['responses'][Code extends never
              ? Extract<keyof T['responses'], number>
              : Code]['content'],
          object
      >['application/json']
    : never

type GetResponseHeaders<
    T,
    Code extends number = GetStatusCodes<T>,
> = T extends {
    responses: {
        [code in Code]: {
            headers: {
                [headerName: string]: any
            }
        }
    }
}
    ? T['responses'][Code]['headers']
    : never

export type {
    HttpMethod,
    OpenapiSpec,
    GetJsonBody,
    GetStatusCodes,
    GetPathParameters,
    GetRequestBody,
    GetQueryParameters,
    GetRequestHeaders,
    GetResponseHeaders,
    GetResponseBody,
}
