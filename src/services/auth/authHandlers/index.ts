import { DependencyInfo } from '@/common/lib/moduleLoading/models/DependencyInfo'
import { HeaderAuthHandlerModule } from '@/services/auth/authHandlers/header/header.auth-handler.module'
import { HeaderAuthHandler } from '@/services/auth/authHandlers/header/header.auth-handler'

export const headerAuthHandler: DependencyInfo = {
    module: HeaderAuthHandlerModule,
    class: HeaderAuthHandler,
}

export const authHandlers: DependencyInfo[] = [
    headerAuthHandler,
]
