import { TLocalizationModelDescriptor } from '@/services/localization/types/TLocalizationModelDescriptor'

export interface ILocalizationResolver {
    localize(propertyDescriptor: TLocalizationModelDescriptor, initialData: Record<string, any>, lang?: string): Promise<string>
}
