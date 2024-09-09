import { ISettingTypeConverter } from '@/services/settings/interfaces/ISettingTypeConverter'

export class BoolTypeConverter implements ISettingTypeConverter<boolean> {
    public readonly availableValues: { [key: string]: boolean }  = {
        '0': false,
        '1': true,
        'true': true,
        'false': false,
    }

    async deserialize(value: boolean): Promise<string> {
        return value ? 'true' : 'false'
    }

    async serialize(value: string): Promise<boolean> {
        if (this.availableValues[value] === undefined) {
            return null
        }
        return this.availableValues[value]
    }

    async validate(value: string): Promise<boolean> {
        const serialized = await this.serialize(value)
        return serialized !== null
    }
}
