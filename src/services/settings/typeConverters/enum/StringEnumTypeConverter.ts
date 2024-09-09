import { ISettingTypeConverter } from '@/services/settings/interfaces/ISettingTypeConverter'

export abstract class StringEnumTypeConverter<T> implements ISettingTypeConverter<T> {
    abstract getType(): Record<string, any>

    async deserialize(value: T): Promise<string> {
        const enumType = this.getType() as Record<string, any>
        return enumType[value.toString()]
    }

    async serialize(value: string): Promise<T> {
        const enumType = this.getType()
        const keys = Object.keys(enumType)
        const index = keys.findIndex(p => enumType[p] === value)
        if (index === -1) {
            return null
        }
        return enumType[keys[index]]
    }

    async validate(value: string): Promise<boolean> {
        const serialized = await this.serialize(value)
        return serialized !== null
    }
}
