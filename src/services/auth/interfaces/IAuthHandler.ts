import { IApiClient } from '@/services/auth/interfaces/IApiClient'
import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'

export interface IAuthHandler {
    getApiClient(request: ApiRequestData): Promise<IApiClient>

    canHandle(request: ApiRequestData): Promise<boolean>
}
