import { ISettingTypeConverter } from '@/services/settings/interfaces/ISettingTypeConverter'

export abstract class NumberEnumTypeConverter<T> implements ISettingTypeConverter<T> {
    abstract getType(): Record<string, any>

    async deserialize(value: T): Promise<string> {
        const enumType = this.getType() as Record<string, any>
        return enumType[value.toString()]
    }

    async serialize(value: string): Promise<T> {
        const enumType = this.getType() as Record<string, any>
        const keys = Object.keys(enumType).filter(k => !isNaN(Number(k)))
        const index = keys.findIndex(p => p === value)
        if (index === -1) {
            return null
        }
        return parseInt(keys[index]) as any
    }

    async validate(value: string): Promise<boolean> {
        const serialized = await this.serialize(value)
        return serialized !== null
    }
}
