export abstract class PartialPropertyStorage<T extends object> {
    public items: Record<string, Record<string, T>> = {}

    public setPropertyField<TKey extends keyof T>(key: string, propertyKey: string, field: TKey, value: T[TKey]): void {
        const property = this.getProperty(key, propertyKey)
        property[field] = value
    }

    public getProperty(key: string, propertyKey: string): T {
        const item = this.getItem(key)
        if (!item[propertyKey]) {
            item[propertyKey] = {} as T
        }
        return item[propertyKey]
    }

    public getItem(key: string, createIfNeeded = true): Record<string, T> {
        if (!this.items[key]) {
            if (createIfNeeded) {
                this.items[key] = {}
            } else {
                return null
            }
        }
        return this.items[key]
    }
}
