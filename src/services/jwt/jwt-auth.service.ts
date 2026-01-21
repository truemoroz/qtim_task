import { Injectable } from '@nestjs/common'
import { IJwt } from '@/common/models/jwt/interfaces/IJwt'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { instanceToPlain } from 'class-transformer'
import { JwtService } from '@nestjs/jwt'
import { User } from '@/common/models/database/user.entity'
import { AccessJwt, AccessJwtPayload } from '@/common/models/jwt/AccessJwt'
import { RefreshJwt, RefreshJwtPayload } from '@/common/models/jwt/RefreshJwt'

type TokenConfigData = {
    secret: string
    expiresIn: string
}
export type JwtTokens = {
    access: string
    refresh: string
}

@Injectable()
export class JwtAuthService {

    constructor(private jwtService: JwtService) {
    }

    async createToken<TToken extends IJwt<TPayload>, TPayload extends Record<string, any>>(type: Constructor<TToken>, payload: TPayload): Promise<string> {
        const configData = JwtAuthService.getConfigData(new type())
        return this.jwtService.signAsync(instanceToPlain(payload), configData)
    }

    async generateTokens(user: User): Promise<JwtTokens> {
        return {
            access: await this.createToken(AccessJwt, new AccessJwtPayload(user.id)),
            refresh: await this.createToken(RefreshJwt, new RefreshJwtPayload(user.id)),
        }
    }

    async checkToken<TToken extends IJwt<any>>(type: Constructor<TToken>, token: string): Promise<boolean> {
        const configData = JwtAuthService.getConfigData(new type())
        let payload
        try {
            payload = await this.jwtService.verifyAsync(token, configData)
            return !!payload
        } catch (err) {
            return false
        }
    }

    async getPayload<TToken extends IJwt<P>, P extends Record<string, any>>(type: Constructor<TToken>, payloadType: Constructor<P>, token: string): Promise<P> {
        const configData = JwtAuthService.getConfigData(new type())
        try {
            return await this.jwtService.verifyAsync<P>(token, configData)
        } catch (err) {
            return null
        }
    }

    private static getConfigData<T extends IJwt<any>>(token: T): TokenConfigData {
        return {
            secret: token.config.secret,
            expiresIn: token.config.expirationTime.toString(),
        }
    }
}
