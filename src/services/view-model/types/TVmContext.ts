import { PropertyInfo } from '@/services/view-model/models/PropertyInfo'
import { IApiClient } from '@/services/auth/interfaces/IApiClient'

export type TVmContext = {
    sourceName: string,
    modelProperties: PropertyInfo[],
    client: IApiClient
}
