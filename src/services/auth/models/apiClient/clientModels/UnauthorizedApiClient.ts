import { ApiClientType } from '@/services/auth/models/apiClient/ApiClientType'
import { ApiClientBase } from '@/services/auth/models/apiClient/clientModels/ApiClientBase'

export class UnauthorizedApiClient extends ApiClientBase {
    type = ApiClientType.UnauthorizedUser

    constructor(lang?: string) {
        super()
        this.setLang(lang)
    }

    getIdentifier(): string {
        return ''
    }

    getFullIdentificationData(): Record<string, any> {
        return {}
    }
}
