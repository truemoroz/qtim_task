import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { ILocalizationNS } from '@/common/localization/interfaces/ILocalizationNS'

export type LocalizationNSConstructor = Constructor<ILocalizationNS>
