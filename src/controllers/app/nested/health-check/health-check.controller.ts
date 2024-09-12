import { Get } from '@nestjs/common'
import { HealthCheckService } from '@/services/app/health-check/health-check.service'
import { HealthCheck, HealthCheckRes } from './models/res/health-check.res'
import { LoggerIgnore } from '@/common/decorators/log/controllers/LoggerIgnore'
import { ApiController } from '@/common/decorators/basic/ApiControllerDecorator'
import { ApiMethodDocs } from '@/common/decorators/basic/ApiMethodDocsDecorator'
import { DocApiTag } from '@/common/docs/DocApiTag'

@ApiController('/app/health-check', DocApiTag.Application)
export class HealthCheckController {
    constructor(private readonly healthCheckService: HealthCheckService) {

    }

    @Get()
    @LoggerIgnore()
    @ApiMethodDocs('Health check application', HealthCheckRes)
    async healthCheck(): Promise<HealthCheckRes> {
        const databaseStatus = await this.healthCheckService.healthCheck()

        const healthCheck = new HealthCheck()
        healthCheck.status = databaseStatus
        healthCheck.uptime = process.uptime()
        healthCheck.timestamp = Date.now()

        const response = new HealthCheckRes()
        response.payload = healthCheck

        return response
    }
}
