import { ISettingTypeConverter } from '@/services/settings/interfaces/ISettingTypeConverter'

export class StringTypeConverter implements ISettingTypeConverter<string> {
    async deserialize(value: string): Promise<string> {
        return value
    }

    async serialize(value: string): Promise<string> {
        return value
    }

    async validate(value: string): Promise<boolean> {
        return typeof value === 'string'
    }
}
