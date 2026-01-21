import { JwtAuthService } from './jwt-auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { Global } from '@nestjs/common'

@Global()
@ServiceModule(JwtAuthService, [JwtModule.register({})], [], [JwtModule, JwtAuthService])
export class JwtAuthServiceModule {
}
