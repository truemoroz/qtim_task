import { PathHelper } from '@/common/lib/path/PathHelper'

export type ArrayData = string | Record<string, any> | number | Array<any> & { [key: string]: any }

export class ArrayHelper {
    static createMap<TKey extends keyof TData & PropertyKey, TData extends ArrayData, TKeyRes extends TData[TKey] & PropertyKey>(array: Array<TData>, key: TKey | PropertyKey[] | string): Record<TKeyRes, TData> {
        const res = {} as Record<TKeyRes, TData>
        for (let i = 0; i < array.length; i++) {
            const arrayKeyValue = PathHelper.resolvePath<TKeyRes>(key, array[i])
            res[arrayKeyValue] = array[i]
        }
        return res
    }

    static createDictionary<TKey extends keyof TData & PropertyKey, TData extends ArrayData, TRes extends TData[TKey] & PropertyKey>(array: Array<TData>, key: string): Record<TRes, Array<TData>> {
        const res = {} as Record<TRes, Array<TData>>
        for (let i = 0; i < array.length; i++) {
            const arrayKeyValue = PathHelper.resolvePath<TRes>(key, array[i])
            if (!res[arrayKeyValue]) {
                res[arrayKeyValue] = []
            }
            res[arrayKeyValue].push(array[i])
        }
        return res
    }
}
