[**ts-openapi-express**](../README.md)

---

[ts-openapi-express](../packages.md) / HttpError

# Class: HttpError

## Extends

- `Error`

## Extended by

- [`RequestBodyTooLargeError`](RequestBodyTooLargeError.md)
- [`InvalidJsonError`](InvalidJsonError.md)
- [`UnauthorizedError`](UnauthorizedError.md)

## Constructors

### Constructor

> **new HttpError**(`message`, `status`): `HttpError`

#### Parameters

##### message

`string`

##### status

`number`

#### Returns

`HttpError`

#### Overrides

`Error.constructor`

## Properties

### status

> `readonly` **status**: `number`

## Methods

### type()

> **type**(): `string`

#### Returns

`string`
