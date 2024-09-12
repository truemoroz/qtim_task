import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'
import { IApiClient } from '@/common/interfaces/auth/IApiClient'

export interface IAuthHandler {
    getApiClient(request: ApiRequestData): Promise<IApiClient>

    canHandle(request: ApiRequestData): Promise<boolean>
}
