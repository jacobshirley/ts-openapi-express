interface IncomingHttpHeaders {
    accept?: string | undefined
    'accept-language'?: string | undefined
    'accept-patch'?: string | undefined
    'accept-ranges'?: string | undefined
    'access-control-allow-credentials'?: string | undefined
    'access-control-allow-headers'?: string | undefined
    'access-control-allow-methods'?: string | undefined
    'access-control-allow-origin'?: string | undefined
    'access-control-expose-headers'?: string | undefined
    'access-control-max-age'?: string | undefined
    'access-control-request-headers'?: string | undefined
    'access-control-request-method'?: string | undefined
    age?: string | undefined
    allow?: string | undefined
    'alt-svc'?: string | undefined
    authorization?: string | undefined
    'cache-control'?: string | undefined
    connection?: string | undefined
    'content-disposition'?: string | undefined
    'content-encoding'?: string | undefined
    'content-language'?: string | undefined
    'content-length'?: string | undefined
    'content-location'?: string | undefined
    'content-range'?: string | undefined
    'content-type'?: string | undefined
    cookie?: string | undefined
    date?: string | undefined
    etag?: string | undefined
    expect?: string | undefined
    expires?: string | undefined
    forwarded?: string | undefined
    from?: string | undefined
    host?: string | undefined
    'if-match'?: string | undefined
    'if-modified-since'?: string | undefined
    'if-none-match'?: string | undefined
    'if-unmodified-since'?: string | undefined
    'last-modified'?: string | undefined
    location?: string | undefined
    origin?: string | undefined
    pragma?: string | undefined
    'proxy-authenticate'?: string | undefined
    'proxy-authorization'?: string | undefined
    'public-key-pins'?: string | undefined
    range?: string | undefined
    referer?: string | undefined
    'retry-after'?: string | undefined
    'sec-websocket-accept'?: string | undefined
    'sec-websocket-extensions'?: string | undefined
    'sec-websocket-key'?: string | undefined
    'sec-websocket-protocol'?: string | undefined
    'sec-websocket-version'?: string | undefined
    'set-cookie'?: string[] | undefined
    'strict-transport-security'?: string | undefined
    tk?: string | undefined
    trailer?: string | undefined
    'transfer-encoding'?: string | undefined
    upgrade?: string | undefined
    'user-agent'?: string | undefined
    vary?: string | undefined
    via?: string | undefined
    warning?: string | undefined
    'www-authenticate'?: string | undefined
}

type StandardRequestHeaders = {
    // copy every declared property from http.IncomingHttpHeaders
    // but remove index signatures
    [K in keyof IncomingHttpHeaders as string extends K
        ? never
        : number extends K
          ? never
          : K]: IncomingHttpHeaders[K]
}

type StandardRequestHeader = Lowercase<keyof StandardRequestHeaders>
type StandardResponseHeader = Lowercase<
    | 'Accept-Ranges'
    | 'Age'
    | 'Allow'
    | 'Cache-Control'
    | 'Content-Disposition'
    | 'Content-Encoding'
    | 'Content-Language'
    | 'Content-Length'
    | 'Content-Location'
    | 'Content-MD5'
    | 'Content-Range'
    | 'Content-Security-Policy'
    | 'Content-Type'
    | 'Date'
    | 'ETag'
    | 'Expires'
    | 'Last-Modified'
    | 'Link'
    | 'Location'
    | 'P3P'
    | 'Pragma'
    | 'Proxy-Authenticate'
    | 'Refresh'
    | 'Retry-After'
    | 'Server'
    | 'Set-Cookie'
    | 'Strict-Transport-Security'
    | 'Trailer'
    | 'Transfer-Encoding'
    | 'Upgrade'
    | 'User-Agent'
    | 'Vary'
    | 'Via'
    | 'Warning'
    | 'WWW-Authenticate'
    | 'X-Content-Type-Options'
    | 'X-Frame-Options'
    | 'X-Powered-By'
    | 'X-XSS-Protection'
>

type StandardHeaderMap = {
    [x in StandardResponseHeader]?: string
}

type HeadersMap = {
    [x in `x-${string}` | `X-${string}` | StandardRequestHeader]?: string
}

export type {
    StandardRequestHeader,
    StandardResponseHeader,
    StandardHeaderMap,
    HeadersMap,
}
