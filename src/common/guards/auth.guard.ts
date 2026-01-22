import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { JwtAuthService } from '@/services/jwt/jwt-auth.service'
import { AccessJwt, AccessJwtPayload } from '@/common/models/jwt/AccessJwt'

@Injectable()
export class AuthGuard implements CanActivate {
    // constructor(private jwtService: JwtService) {}
    constructor(private jwtAuthService: JwtAuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if (!token) {
            throw new UnauthorizedException()
        }
        try {
            await this.jwtAuthService.getPayload(AccessJwt, AccessJwtPayload, token)
            // const payload = await this.jwtAuthService.getPayload(AccessJwt, AccessJwtPayload, token)
            // request['user'] = payload
        } catch {
            throw new UnauthorizedException()
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
