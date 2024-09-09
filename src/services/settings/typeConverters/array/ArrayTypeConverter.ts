import { ISettingTypeConverter } from '@/services/settings/interfaces/ISettingTypeConverter'

export class ArrayTypeConverter implements ISettingTypeConverter<Array<any>> {
    async deserialize(value: Array<any>): Promise<string> {
        return JSON.stringify(value)
    }

    async serialize(value: string): Promise<Array<any>> {
        return JSON.parse(value)
    }

    async validate(value: string): Promise<boolean> {
        try {
            await this.serialize(value)
            return true
        } catch (e) {
            return false
        }
    }
}
