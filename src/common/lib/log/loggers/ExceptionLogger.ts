import { LogLevel } from '@nestjs/common'
import { LogLabels } from '@/common/lib/log/models/LogLabels'
import { IExceptionLogger } from '@/common/lib/log/interfaces/IExceptionLogger'
import { ApplicationLogger } from '@/common/lib/log/loggers/ApplicationLogger'
import { LoggerBase } from '@/common/lib/log/loggers/base/LoggerBase'
import _ from 'lodash'

export class ExceptionLogger extends LoggerBase implements IExceptionLogger {
    private static readonly baseExceptionKeys = ['parent', 'baseException', '$response']

    constructor(context?: string) {
        super(context)
    }

    logException(exception: any, labels?: LogLabels, logLevel: LogLevel = 'warn', firstLine = true): void {
        ExceptionLogger.logExceptionInternal(exception, this.fillDefaultLabels(labels), logLevel, 'Exception', firstLine)
    }

    logCriticalException(exception: any, labels?: LogLabels, logLevel: LogLevel = 'error', firstLine = true): void {
        ExceptionLogger.logExceptionInternal(exception, this.fillDefaultLabels(labels), logLevel, 'Critical exception', firstLine)
    }

    private static logExceptionInternal(exception: any, labels: LogLabels, logLevel: LogLevel, context: string, firstLine = true): void {
        if (exception.errors) {
            for (let i = 0; i < exception.errors.length; i++) {
                ApplicationLogger.logDefault(logLevel, exception.errors[i], labels, context + ' | errors', firstLine)
                firstLine = false
            }
        }
        if (exception.stack) {
            ApplicationLogger.logDefault(logLevel, exception.stack, labels, context, firstLine)
            firstLine = false
        }
        const exceptionKeys = Object.keys(exception)
        const resultData: Record<string, any> = {}
        for (let i = 0; i < exceptionKeys.length; i++) {
            const key = exceptionKeys[i]
            const value = exception[key]
            if (!_.isObject(value) && !Array.isArray(value)) {
                resultData[key] = value
            }
        }
        ApplicationLogger.logDefault(logLevel, resultData, labels, context + '.rawData', firstLine)
        for (let i = 0; i < this.baseExceptionKeys.length; i++) {
            const key = this.baseExceptionKeys[i]
            if (exception[key]) {
                this.logExceptionInternal(exception[key], labels, logLevel, context + ' -> ' + key, false)
            }
        }
    }
}
