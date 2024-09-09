import { ISettingTypeConverter } from '@/services/settings/interfaces/ISettingTypeConverter'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

export interface ISettingDescriptor<T> {
    readonly name: string
    readonly converter: Constructor<ISettingTypeConverter<T>>
}
