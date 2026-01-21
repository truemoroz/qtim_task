import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { HealthCheckService } from '@/services/app/health-check/health-check.service'
// import { ServiceSequelizeModule } from '@/modules/sequelize/ServiceSequelizeModule'

@ServiceModule(HealthCheckService)
export class HealthCheckServiceModule {

}
