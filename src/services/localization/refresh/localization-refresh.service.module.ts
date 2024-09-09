import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { LocalizationRefreshService } from './localization-refresh.service'


@ServiceModule(LocalizationRefreshService)
export class LocalizationRefreshServiceModule {
}
