import { IApiClient } from '@/common/interfaces/auth/IApiClient'

export interface ITokenHandler {
    loadClient(token: string): Promise<IApiClient>
}
