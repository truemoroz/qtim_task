import { LocalizationNSConstructor } from '@/common/localization/interfaces/LocalizationNSConstructor'

export interface IApiException {
    readonly code: number
    readonly errorName: string
    readonly ns: LocalizationNSConstructor
}
