import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { SettingsService } from './settings.service'
import { Global } from '@nestjs/common'
import { AutoloadService } from '@/common/decorators/basic/AutoloadServiceDecorator'
import { SettingDataSourceModule } from '@/data-sources/setting/setting.data-source.module'

@Global()
@AutoloadService()
@ServiceModule(SettingsService, [SettingDataSourceModule])
export class SettingsServiceModule {
}
