import { ApiClientType } from '@/services/auth/models/apiClient/ApiClientType'
import { ApiClientBase } from '@/services/auth/models/apiClient/clientModels/ApiClientBase'
import { User } from '@/common/models/database/User'

export class UserApiClient extends ApiClientBase {
  type = ApiClientType.ClientUser

  constructor(public user: User) {
    super()
  }

  getIdentifier(): string {
    return this.user.id.toString()
  }

  getFullIdentificationData(): Record<string, any> {
    return {
      userId: this.user.id,
      email: this.user.email,
    }
  }

}
