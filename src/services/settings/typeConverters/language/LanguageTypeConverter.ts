import { ISettingTypeConverter } from '@/services/settings/interfaces/ISettingTypeConverter'
import { Language } from '@/common/models/database/Language'

export class LanguageTypeConverter implements ISettingTypeConverter<string> {
    async deserialize(value: string): Promise<string> {
        return value
    }

    async validate(value: string): Promise<boolean> {
        const language = await Language.query()
            .select(['id'])
            .getByPK(value)
        return !!language
    }

    async serialize(value: string): Promise<string> {
        return value
    }
}
