import { IApiClient } from '@/services/auth/interfaces/IApiClient'

export type TVmPropertyContext = {
    sourceName: string,
    destinationName: string,
    propertyValue: any,
    client: IApiClient
}
