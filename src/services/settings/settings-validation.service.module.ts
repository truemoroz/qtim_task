import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { SettingsValidationService } from '@/services/settings/settings-validation.service'

@ServiceModule(SettingsValidationService)
export class SettingsValidationServiceSnippet {}
