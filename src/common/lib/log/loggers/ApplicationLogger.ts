import { IApplicationLogger } from '@/common/lib/log/interfaces/IApplicationLogger'
import { Logger, LogLevel } from '@nestjs/common'
import { LogLabels } from '@/common/lib/log/models/LogLabels'
import { RequestLabels } from '@/common/lib/log/request/models/RequestLabels'
import { LoggerBase } from '@/common/lib/log/loggers/base/LoggerBase'

export class ApplicationLogger extends LoggerBase implements IApplicationLogger {
    constructor(context?: string) {
        super(context)
    }

    log(message: any, labels?: LogLabels, context?: string, firstLine = true): void {
        ApplicationLogger.logDefault('log', message, this.fillDefaultLabels(labels), this.getContext(context), firstLine)
    }

    warn(message: any, labels?: LogLabels, context?: string, firstLine = true): void {
        ApplicationLogger.logDefault('warn', message, this.fillDefaultLabels(labels), this.getContext(context), firstLine)
    }

    error(message: any, labels?: LogLabels, context?: string, firstLine = true): void {
        ApplicationLogger.logDefault('error', message, this.fillDefaultLabels(labels), this.getContext(context), firstLine)
    }

    public static logDefault(type: LogLevel, message: string | Record<string, any>, labels: RequestLabels, context?: string, firstLine = true): void {
        if (type == 'error') {
            Logger.error({
                message,
                labels,
                firstLine,
            }, null, context)
        } else {
            Logger[type]({
                message,
                labels,
                firstLine,
            }, context)
        }
    }
}
