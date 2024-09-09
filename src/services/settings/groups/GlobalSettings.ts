import { ISettingGroup } from '@/services/settings/interfaces/ISettingGroup'
import { BaseSettingDescriptor } from '@/services/settings/descriptors/BaseSettingDescriptor'
import { TimeZoneTypeConverter } from '@/services/settings/typeConverters/timeZone/TimeZoneTypeConverter'
import { LanguageTypeConverter } from '@/services/settings/typeConverters/language/LanguageTypeConverter'


export class GlobalSettings implements ISettingGroup {
    readonly GROUP = 'ga_global_settings'

    static readonly DEFAULT_LANGUAGE = 'en-US'

    static readonly defaultLanguage = new BaseSettingDescriptor('defaultLanguage', LanguageTypeConverter)
    static readonly timeZone = new BaseSettingDescriptor('timeZone', TimeZoneTypeConverter)
}
