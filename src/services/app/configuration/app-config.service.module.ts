import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { AppConfigService } from './app-config.service'
import { Global } from '@nestjs/common'
import { AutoloadService } from '@/common/decorators/basic/AutoloadServiceDecorator'


@ServiceModule(AppConfigService)
@Global()
@AutoloadService()
export class AppConfigServiceModule {
}
