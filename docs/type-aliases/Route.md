[**ts-openapi-express**](../README.md)

---

[ts-openapi-express](../packages.md) / Route

# Type Alias: Route\<Schema\>

> **Route**\<`Schema`\> = `object`

## Type Parameters

### Schema

`Schema`

## Properties

### handler()

> **handler**: (`request`) => [`HandlerResult`](HandlerResult.md)\<`Schema`\>

#### Parameters

##### request

[`OpenapiRequest`](OpenapiRequest.md)\<`Schema`\>

#### Returns

[`HandlerResult`](HandlerResult.md)\<`Schema`\>

---

### middleware?

> `optional` **middleware**: (`request`) => [`HandlerResult`](HandlerResult.md)\<`Schema`\>[]

#### Parameters

##### request

[`OpenapiRequest`](OpenapiRequest.md)\<`Schema`\>

#### Returns

[`HandlerResult`](HandlerResult.md)\<`Schema`\>
