import { Injectable, OnModuleInit } from '@nestjs/common'
import { IAuthHandler } from '@/services/auth/interfaces/IAuthHandler'
import { ModuleRef } from '@nestjs/core'
import { TokenPrefix } from '@/services/auth/authHandlers/header/models/TokenPrefix'
import { ITokenHandler } from '@/services/auth/interfaces/ITokenHandler'
import { tokenHandlerPrefixMatch } from '@/services/auth/authHandlers/header/models/tokenHandlerPrefixMatch'
import { IncorrectAuthorizationTypeException } from '@/common/exceptions/apiExceptions'
import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'
import { IApiClient } from '@/services/auth/interfaces/IApiClient'

@Injectable()
export class HeaderAuthHandler implements IAuthHandler, OnModuleInit {
    private tokenHandlers: Record<TokenPrefix | string, ITokenHandler> = {}

    constructor(private readonly moduleRef: ModuleRef) {
    }

    async onModuleInit(): Promise<void> {
        const keys = Object.keys(tokenHandlerPrefixMatch)
        for (let i = 0; i < keys.length; i++) {
            const prefix = keys[i] as TokenPrefix
            const tokenHandlerConstructor = tokenHandlerPrefixMatch[prefix]
            this.tokenHandlers[prefix] = await this.moduleRef.get(tokenHandlerConstructor, { strict: false })
        }
    }

    getApiClient(request: ApiRequestData): Promise<IApiClient> {
        const authHeader = request.headers.authorization
        const [prefix, token] = authHeader.split(' ')

        if (!this.tokenHandlers[prefix] || !token) {
            throw new IncorrectAuthorizationTypeException()
        }

        return this.tokenHandlers[<TokenPrefix>prefix].loadClient(token)
    }

    async canHandle(request: ApiRequestData): Promise<boolean> {
        return !!request.headers.authorization
    }
}
