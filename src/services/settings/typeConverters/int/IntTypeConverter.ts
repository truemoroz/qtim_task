import { ISettingTypeConverter } from '@/services/settings/interfaces/ISettingTypeConverter'

export class IntTypeConverter implements ISettingTypeConverter<number> {
    async deserialize(value: number): Promise<string> {
        return value.toString()
    }

    async serialize(value: string): Promise<number> {
        const val = parseInt(value)
        if (isNaN(val)) {
            return null
        }
        return val
    }

    async validate(value: string): Promise<boolean> {
        const serialized = await this.serialize(value)
        return serialized !== null
    }

}
