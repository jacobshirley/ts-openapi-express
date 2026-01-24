import { OpenapiRequest } from './types.js'

const validateRequest = <T>(req: any): req is OpenapiRequest<T> => {
    //TODO: validate the request
    return true
}

const openapiPathToExpressPath = (openapiPath: string): string => {
    return openapiPath.replace(/\{/gm, ':').replace(/\}/gm, '')
}

const redirect = (url: string) => {
    return {
        302: {
            headers: {},
            body: `<head><meta http-equiv="Refresh" content="0; URL=${url}" /></head>`,
        },
    }
}

export { validateRequest, openapiPathToExpressPath, redirect }
