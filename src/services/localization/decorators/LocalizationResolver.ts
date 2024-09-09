import { LocalizationService } from '@/services/localization/localization.service'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { ILocalizationResolver } from '@/services/localization/interfaces/ILocalizationResolver'

export const LocalizationResolver = (resolverFn: () => Constructor<ILocalizationResolver>) =>
    (target: any, property: string): void => {
        LocalizationService.modelStorage.setPropertyField(target.constructor.name, property, 'localizationResolver', resolverFn())
        LocalizationService.modelStorage.setPropertyField(target.constructor.name, property, 'key', property)
    }
