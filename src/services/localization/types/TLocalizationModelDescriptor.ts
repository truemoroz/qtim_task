import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { ILocalizationResolver } from '@/services/localization/interfaces/ILocalizationResolver'
import { LocalizationNSTemplateBase } from '@/common/localization/namespaces/base/LocalizationNSTemplateBase'

export type TLocalizationModelDescriptor = {
    key?: string
    namespaceTemplate?: Constructor<LocalizationNSTemplateBase<any>>
    localizationResolver?: Constructor<ILocalizationResolver>
    localizationResolverInstance?: ILocalizationResolver
}
