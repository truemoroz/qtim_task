import { IJwt } from '@/common/models/jwt/interfaces/IJwt'
import { AppConfigService } from '@/services/app/configuration/app-config.service'
import { AccessJwtConfig } from '@/common/models/config'

export class AccessJwtPayload {
    userId: number
    userAccount: boolean
}

export class AccessJwt implements IJwt<AccessJwtPayload> {
    payload: AccessJwtPayload
    readonly config = AppConfigService.getModel(AccessJwtConfig)
}
