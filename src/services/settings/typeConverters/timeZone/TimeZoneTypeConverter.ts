import { TimeZoneType } from '@/services/settings/typeConverters/timeZone/TimeZoneType'
import { StringEnumTypeConverter } from '@/services/settings/typeConverters/enum/StringEnumTypeConverter'

export class TimeZoneTypeConverter extends StringEnumTypeConverter<typeof TimeZoneType> {
    getType(): typeof TimeZoneType {
        return TimeZoneType
    }
}
