import { TokenPrefix } from '@/services/auth/authHandlers/header/models/TokenPrefix'
import { ITokenHandler } from '@/services/auth/interfaces/ITokenHandler'
import { JwtTokenHandler } from '@/services/auth/tokenHandlers/jwt/jwt.token-handler'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

export const tokenHandlerPrefixMatch: Record<TokenPrefix, Constructor<ITokenHandler>> = {
    [TokenPrefix.Bearer]: JwtTokenHandler,
}
