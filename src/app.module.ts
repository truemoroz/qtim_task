import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiVersion } from '@/common/application/versioning/enum/ApiVersion'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static readonly SERVICE_NAME = 'service_name'
  static readonly API_VERSION_DEFINITIONS: Record<ApiVersion, string> = {
    [ApiVersion.V1]: '1.0.0',
  }
}
