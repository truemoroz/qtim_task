import { DependencyInfo } from '@/common/lib/moduleLoading/models/DependencyInfo'
import { JwtTokenHandler } from '@/services/auth/tokenHandlers/jwt/jwt.token-handler'
import { JwtTokenHandlerModule } from '@/services/auth/tokenHandlers/jwt/jwt.token-handler.module'

export const jwtTokenHandler: DependencyInfo = {
  module: JwtTokenHandlerModule,
  class: JwtTokenHandler,
}

export const tokenHandlers: DependencyInfo[] = [
  jwtTokenHandler,
]
