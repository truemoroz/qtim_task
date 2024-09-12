import { ArgumentsHost, Catch, Logger } from '@nestjs/common'
import { CriticalApiException } from '@/common/exceptions/CriticalApiException'
import { ApiExceptionFilter } from '@/common/exceptionFilters/ApiExceptionFilter'
import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'
import { ApplicationConfig } from '@/common/models/config'
import { AlertsConfig } from '@/common/models/config/'
import { RemoteRequest } from '@/common/lib/remoteRequest/RemoteRequest'
import { LogLabels } from '@/common/lib/log/models/LogLabels'


@Catch(CriticalApiException)
export class CriticalApiExceptionFilter extends ApiExceptionFilter {
    async catch(exception: CriticalApiException, host: ArgumentsHost): Promise<void> {
        await super.catch(exception, host)
        CriticalApiExceptionFilter.sendException(exception).catch(err => {
            Logger.error(err)
        })
    }

    public static async sendException(exception: CriticalApiException): Promise<void> {
        const applicationConfig = ConfigLoader.getModelConfig(ApplicationConfig)
        const alertsConfig = ConfigLoader.getModelConfig(AlertsConfig)
        const { token, url } = alertsConfig
        if (!url || !token) {
            return
        }

        const remoteRequest = new RemoteRequest({
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const responseBody = {
            critical: exception.criticalLevel,
            error: exception.message,
            stand: applicationConfig.standName,
            exceptionData: JSON.stringify(exception.data),
        }
        const response = await remoteRequest.post(url, responseBody)
        const labels: LogLabels = {
            service: CriticalApiExceptionFilter.name,
        }
        Logger.log({
            message: 'Alert sent',
            labels,
        }, CriticalApiExceptionFilter.name)
        Logger.log({
            message: response,
            labels,
        }, CriticalApiExceptionFilter.name)
    }
}
