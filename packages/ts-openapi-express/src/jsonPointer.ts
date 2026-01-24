import { parseDocument } from 'yaml'
import { get } from 'lodash-es'
import * as fs from 'fs'
import * as path from 'path'

function resolveLocal<T>(object: object, ref: string): T {
    const [p, element] = ref.split('#')

    return get(object, element.split('/').filter(Boolean))
}

function resolvePointer<T>(
    object: T,
    options?: {
        resolveLocalRefs?: boolean
    },
    parent: any = object,
    currentPath?: string,
    element?: string,
): T {
    const resolveLocal = options?.resolveLocalRefs ?? true
    const data = element
        ? get(object, element.split('/').filter(Boolean))
        : object

    for (const key in data) {
        const value = data[key]
        if (typeof value === 'object') {
            data[key] = resolvePointer(value, options, parent, currentPath, '')
            continue
        }

        if (key !== '$ref') continue

        const [p, element] = (value + '').split('#')
        if (p === '' && !resolveLocal) continue

        return !currentPath
            ? get(parent, element.split('/').filter(Boolean))
            : resolveFile(
                  path.join(p ? path.dirname(currentPath) : currentPath, p),
                  options,
                  element,
              )
    }

    return data
}

function resolveFile<T = any>(
    path: string,
    options?: {
        resolveLocalRefs?: boolean
    },
    element: string = '',
): T {
    const src = fs.readFileSync(path, 'utf-8')

    const object = path.endsWith('.yaml')
        ? parseDocument(src).toJSON()
        : JSON.parse(src)

    const result = resolvePointer(object, options, object, path, element)

    return result
}

export { resolveLocal, resolveFile, resolvePointer }
