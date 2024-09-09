import { LogLabels } from '@/common/lib/log/models/LogLabels'

export interface IApplicationLogger {
    log(message: any, labels?: LogLabels, context?: string): void

    warn(message: any, labels?: LogLabels, context?: string): void

    error(message: any, labels?: LogLabels, context?: string): void
}
