import { ApiClientType } from '@/services/auth/models/apiClient/ApiClientType'
import { Admin } from '@/common/models/database/Admin'
import { AuthService } from '@/services/auth/auth.service'
import { ApiClientBase } from '@/services/auth/models/apiClient/clientModels/ApiClientBase'

export class AdminApiClient extends ApiClientBase {
    type = ApiClientType.AdminUser

    roles = AuthService.DEFAULT_ADMIN_ROLES

    constructor(public admin: Admin) {
        super()
    }

    getIdentifier(): string {
        return this.admin.id.toString()
    }

    getFullIdentificationData(): Record<string, any> {
        return {
            adminEmail: this.admin.email,
            adminId: this.admin.id,
        }
    }
}
