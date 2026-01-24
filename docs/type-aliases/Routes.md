[**ts-openapi-express**](../README.md)

---

[ts-openapi-express](../packages.md) / Routes

# Type Alias: Routes\<Paths\>

> **Routes**\<`Paths`\> = `{ [Path in keyof Paths]: { [Method in Extract<keyof Paths[Path], HttpMethod> as [undefined] extends [Paths[Path][Method]] ? never : Method]: Route<Paths[Path][Method]> } }`

## Type Parameters

### Paths

`Paths`
