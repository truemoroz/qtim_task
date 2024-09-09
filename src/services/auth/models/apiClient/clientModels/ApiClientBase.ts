import { IApiClient } from '@/services/auth/interfaces/IApiClient'
import { ApiClientType } from '@/services/auth/models/apiClient/ApiClientType'
import { AuthService } from '@/services/auth/auth.service'

export abstract class ApiClientBase implements IApiClient {
    ip: string
    roles: string[] = []
    lang: string

    abstract type: ApiClientType

    isAdmin(): boolean {
        return this.roles.some(role => AuthService.DEFAULT_ADMIN_ROLES.includes(role))
    }

    isAuthorized(): boolean {
        return this.type != ApiClientType.UnauthorizedUser
    }

    setLang(lang: string): void {
        this.lang = lang
    }

    abstract getIdentifier(): string

    abstract getFullIdentificationData(): Record<string, any>
}
