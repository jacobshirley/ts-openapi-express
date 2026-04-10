[**ts-openapi-express**](../README.md)

---

[ts-openapi-express](../packages.md) / openapiExpress

# Function: openapiExpress()

> **openapiExpress**\<`Spec`\>(`options`): [`OpenapiApplication`](../type-aliases/OpenapiApplication.md)\<`Spec`\>

## Type Parameters

### Spec

`Spec`

## Parameters

### options

#### app?

`Application`

#### decodeJsonBody?

`boolean`

#### disableXPoweredBy?

`boolean`

#### errorMiddleware?

[`ExpressMiddlewareWithError`](../type-aliases/ExpressMiddlewareWithError.md)[]

#### handleHttpErrors?

`boolean`

#### middleware?

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)[]

#### routes

[`Routes`](../type-aliases/Routes.md)\<`Spec`\>

#### specPath

`string`

#### validateRequest?

`boolean`

#### validateResponse?

`boolean`

## Returns

[`OpenapiApplication`](../type-aliases/OpenapiApplication.md)\<`Spec`\>
