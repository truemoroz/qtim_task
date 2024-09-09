import { Injectable } from '@nestjs/common'
import { AccessJwt, AccessJwtPayload } from '@/common/models/jwt/AccessJwt'
import { User } from '@/common/models/database/User'
import { Admin } from '@/common/models/database/Admin'
import { JwtAuthService } from '@/services/jwt/jwt-auth.service'
import { ServiceUserApiClient } from '@/services/auth/models/apiClient/clientModels/ServiceUserApiClient'
import { AdminApiClient } from '@/services/auth/models/apiClient/clientModels/AdminApiClient'
import { AuthService } from '@/services/auth/auth.service'
import { ITokenHandler } from '@/services/auth/interfaces/ITokenHandler'
import { IApiClient } from '@/services/auth/interfaces/IApiClient'
import { UnauthorizedApiClient } from '@/services/auth/models/apiClient/clientModels/UnauthorizedApiClient'
import { UserApiClient } from '@/services/auth/models/apiClient/clientModels/UserApiClient'

@Injectable()
export class JwtTokenHandler implements ITokenHandler {
    constructor(private readonly jwtAuthService: JwtAuthService) {
    }

    async loadClient(token: string): Promise<IApiClient> {
        const jwtPayload: AccessJwtPayload = await this.jwtAuthService.getPayload(AccessJwt, AccessJwtPayload, token)
        if (!jwtPayload) {
            return new UnauthorizedApiClient()
        }

        let client: IApiClient

        if (jwtPayload.userAccount) {
            const userQuery = await User.query().where({ id: jwtPayload.userId })
            const user = await userQuery.tryGetOne()
            client = new UserApiClient(user)
        } else {
            const admin = await Admin.query().tryFindByPk(jwtPayload.userId)
            if (admin.email === AuthService.SERVICE_USER_EMAIL) {
                client = new ServiceUserApiClient(admin)
            } else {
                client = new AdminApiClient(admin)
            }
        }
        return client
    }
}
