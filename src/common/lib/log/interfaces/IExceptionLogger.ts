import { LogLabels } from '@/common/lib/log/models/LogLabels'
import { LogLevel } from '@nestjs/common'

export interface IExceptionLogger {
    logException(exception: any, labels?: LogLabels, logLevel?: LogLevel): void
    logCriticalException(exception: any, labels?: LogLabels, logLevel?: LogLevel): void
}
