import { ApiClientType } from '@/services/auth/models/apiClient/ApiClientType'

export interface IApiClient {
    type: ApiClientType
    roles: string[]
    ip: string
    lang: string

    isAdmin(): boolean

    isAuthorized(): boolean

    getIdentifier(): string

    getFullIdentificationData(): Record<string, any>

    setLang(lang: string): void
}
