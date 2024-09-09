import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { JwtTokenHandler } from './jwt.token-handler'


@ServiceModule(JwtTokenHandler)
export class JwtTokenHandlerModule {
}
