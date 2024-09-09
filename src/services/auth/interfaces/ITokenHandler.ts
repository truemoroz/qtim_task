import { IApiClient } from '@/services/auth/interfaces/IApiClient'

export interface ITokenHandler {
    loadClient(token: string): Promise<IApiClient>
}
