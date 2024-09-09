import { Injectable } from '@nestjs/common'
import { ILocalizationResolver } from '@/services/localization/interfaces/ILocalizationResolver'
import { TLocalizationModelDescriptor } from '@/services/localization/types/TLocalizationModelDescriptor'
import { LocalizationService } from '@/services/localization/localization.service'


@Injectable()
export class DefaultLocalizationResolver implements ILocalizationResolver {
    constructor(
        private readonly localizationService: LocalizationService,
    ) {
    }

    async localize(propertyDescriptor: TLocalizationModelDescriptor, initialData: Record<string, any>, lang?: string): Promise<string> {
        const { namespaceTemplate } = propertyDescriptor
        const namespaceTemplateInstance = new namespaceTemplate()
        const namespace = await namespaceTemplateInstance.resolveNamespace(initialData)
        if (namespace) {
            const message = await this.localizationService.translate(namespace, { lang })
            return message == namespace ? '' : message
        }
        return ''
    }
}
