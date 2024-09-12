import { PropertyInfo } from '@/services/view-model/models/PropertyInfo'
import { IApiClient } from '@/common/interfaces/auth/IApiClient'

export type TVmContext = {
    sourceName: string,
    modelProperties: PropertyInfo[],
    client: IApiClient
}
