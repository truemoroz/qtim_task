import { HealthCheckController } from './health-check.controller'
import { HealthCheckServiceModule } from '@/services/app/health-check/health-check.service.module'
import { ControllerModule } from '@/common/decorators/basic/ControllerModuleDecorator'


@ControllerModule(HealthCheckController, [HealthCheckServiceModule])
export class HealthCheckControllerModule {
}
