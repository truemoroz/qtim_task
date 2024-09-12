import { ArrayData } from '@/common/lib/array/ArrayHelper'

export class PathHelper {
    public static resolvePath<TRes>(path: PropertyKey | PropertyKey[], obj: Record<PropertyKey, any> | ArrayData, separator = '.'): TRes {
        const properties = Array.isArray(path) ? path : path.toString().split(separator)
        return properties.reduce((prev, curr) => prev && (prev as Record<PropertyKey, any>)[curr], obj)
    }

    public static insertValueByKeyPath(obj: Record<string, any>, keyPath: string, value: any): void {
        const keys = keyPath.split('.')
        let currentObj = obj

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            if (!currentObj.hasOwnProperty(key) || typeof currentObj[key] !== 'object') {
                currentObj[key] = {}
            }
            currentObj = currentObj[key]
        }

        const lastKey = keys[keys.length - 1]
        currentObj[lastKey] = value
    }
}
