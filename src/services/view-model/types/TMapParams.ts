import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { IApiClient } from '@/services/auth/interfaces/IApiClient'

export type TMapParams<T> = {
    source: Record<string, any>,
    destinationType: Constructor<T>,
    client: IApiClient,
    ignoreBaseModelHandler?: boolean
}
