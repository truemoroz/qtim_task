import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { LocalizationService } from './localization.service'
import { AutoloadService } from '@/common/decorators/basic/AutoloadServiceDecorator'
import { Global } from '@nestjs/common'
import { PathDependencyLoader } from '@/common/lib/moduleLoading/PathDependencyLoader'
import path from 'path'
import { LocalizationRefreshServiceModule } from '@/services/localization/refresh/localization-refresh.service.module'

const modules = PathDependencyLoader.loadClassesFromPathRecursive(path.resolve(__dirname, 'localizationResolvers'))

@AutoloadService()
@Global()
@ServiceModule(LocalizationService, [...modules, LocalizationRefreshServiceModule])
export class LocalizationServiceModule {
}
