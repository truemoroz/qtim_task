import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { DefaultLocalizationResolver } from './default.localization-resolver'


@ServiceModule(DefaultLocalizationResolver)
export class DefaultLocalizationResolverModule {
}
