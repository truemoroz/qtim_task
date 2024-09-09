import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { HeaderAuthHandler } from './header.auth-handler'
import { tokenHandlers } from '@/services/auth/tokenHandlers'


@ServiceModule(HeaderAuthHandler, [
    ...tokenHandlers.map(p => p.module),
])
export class HeaderAuthHandlerModule {
}
