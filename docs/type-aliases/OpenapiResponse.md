[**ts-openapi-express**](../README.md)

---

[ts-openapi-express](../packages.md) / OpenapiResponse

# Type Alias: OpenapiResponse\<T, Code\>

> **OpenapiResponse**\<`T`, `Code`\> = \{ \[code in NoInfer\<Code\>\]?: \{ headers: GetResponseHeaders\<T, code\> & StandardHeaderMap \} & (GetResponseBody\<T, code\> extends \[undefined\] ? \{\} : \{ body: GetResponseBody\<T, code\> \| \{ toJSON: any \} \| Readable \| ReadableStream\<\{ toString: any \}\> \| Iterable\<\{ toString: any \}\> \| AsyncIterable\<\{ toString: any \}\> \}) \}

## Type Parameters

### T

`T`

### Code

`Code` _extends_ `GetStatusCodes`\<`T`\> = `GetStatusCodes`\<`T`\>
