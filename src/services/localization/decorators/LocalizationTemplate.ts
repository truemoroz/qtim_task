import { LocalizationService } from '@/services/localization/localization.service'
import { DefaultLocalizationResolver } from '@/services/localization/localizationResolvers/default/default.localization-resolver'
import { LocalizationNSTemplateBase } from '@/common/localization/namespaces/base/LocalizationNSTemplateBase'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

export const LocalizationTemplate = (namespaceTemplateFn: () => Constructor<LocalizationNSTemplateBase<any>>) =>
    (target: any, property: string): void => {
        LocalizationService.modelStorage.setPropertyField(target.constructor.name, property, 'namespaceTemplate', namespaceTemplateFn())
        LocalizationService.modelStorage.setPropertyField(target.constructor.name, property, 'localizationResolver', DefaultLocalizationResolver)
        LocalizationService.modelStorage.setPropertyField(target.constructor.name, property, 'key', property)
    }
