import { Injectable, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { IAuthHandler } from '@/services/auth/interfaces/IAuthHandler'
import { authHandlers } from '@/services/auth/authHandlers'
import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'
import { UnauthorizedApiClient } from '@/services/auth/models/apiClient/clientModels/UnauthorizedApiClient'

@Injectable()
export class AuthService implements OnModuleInit {
    public static readonly SERVICE_USER_EMAIL = 'service@mlm-soft.com'
    public static readonly DEFAULT_ADMIN_ROLES = ['kernel_admin']

    private readonly authHandlers: IAuthHandler[] = []

    constructor(private readonly moduleRef: ModuleRef) {
    }

    async onModuleInit(): Promise<void> {
        for (let i = 0; i < authHandlers.length; i++) {
            const handler = await this.moduleRef.get(authHandlers[i].class, { strict: false })
            this.authHandlers.push(handler)
        }
    }

    async setClient(request: ApiRequestData): Promise<void> {
        for (let i = 0; i < this.authHandlers.length; i++) {
            const handler = this.authHandlers[i]
            if (await handler.canHandle(request)) {
                const client = await handler.getApiClient(request)
                if (!client) {
                    continue
                }
                client.ip = request.ip
                client.setLang(request.i18nLang)
                request.apiClient = client
                return
            }
        }
        request.apiClient = new UnauthorizedApiClient(request.i18nLang)
    }
}
