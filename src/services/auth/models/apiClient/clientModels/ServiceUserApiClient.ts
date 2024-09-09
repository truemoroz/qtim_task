import { AdminApiClient } from '@/services/auth/models/apiClient/clientModels/AdminApiClient'
import { ApiClientType } from '@/services/auth/models/apiClient/ApiClientType'

export class ServiceUserApiClient extends AdminApiClient {
    type = ApiClientType.ServiceUser
}
