import { IApiClient } from '@/common/interfaces/auth/IApiClient'

export type TVmPropertyContext = {
    sourceName: string,
    destinationName: string,
    propertyValue: any,
    client: IApiClient
}
