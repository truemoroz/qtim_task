import { ISettingDescriptor } from '@/services/settings/interfaces/ISettingDescriptor'
import { ISettingTypeConverter } from '@/services/settings/interfaces/ISettingTypeConverter'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

export class BaseSettingDescriptor<T> implements ISettingDescriptor<T> {
    constructor(
        public readonly name: string,
        public readonly converter: Constructor<ISettingTypeConverter<T>>,
    ) {
    }
}
