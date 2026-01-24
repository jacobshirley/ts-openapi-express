[**ts-openapi-express**](../README.md)

---

[ts-openapi-express](../packages.md) / OpenapiRequest

# Type Alias: OpenapiRequest\<T\>

> **OpenapiRequest**\<`T`\> = `Omit`\<`ExpressRequest`, `"query"` \| `"params"` \| `"body"` \| `"header"` \| `"headers"`\> & `object`

## Type Declaration

### body

> **body**: `GetRequestBody`\<`T`\>

### header()

> **header**: \<`THeader`\>(`header`) => `GetRequestHeaders`\<`T`\>\[`THeader`\]

#### Type Parameters

##### THeader

`THeader` _extends_ keyof `GetRequestHeaders`\<`T`\>

#### Parameters

##### header

`StandardRequestHeader` | `THeader`

#### Returns

`GetRequestHeaders`\<`T`\>\[`THeader`\]

### headers

> **headers**: `StandardHeaderMap` & `GetRequestHeaders`\<`T`\>

### params

> **params**: `GetPathParameters`\<`T`\>

### query

> **query**: `GetQueryParameters`\<`T`\>

## Type Parameters

### T

`T`
