import { IJwt } from '@/common/models/jwt/interfaces/IJwt'
import { AppConfigService } from '@/services/app/configuration/app-config.service'
import { RefreshJwtConfig } from '@/common/models/config'

export class RefreshJwtPayload {
    userId: string
    constructor(userId: string) {
        this.userId = userId
    }
}

export class RefreshJwt implements IJwt<RefreshJwtPayload> {
    payload: RefreshJwtPayload
    readonly config = AppConfigService.getModel(RefreshJwtConfig)
}
