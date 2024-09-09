import { AuthService } from './auth.service'
import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { authHandlers } from '@/services/auth/authHandlers'
import { Global } from '@nestjs/common'
import { AutoloadService } from '@/common/decorators/basic/AutoloadServiceDecorator'

@Global()
@AutoloadService()
@ServiceModule(AuthService, [
    ...authHandlers.map(p => p.module),
])
export class AuthServiceModule {
}
