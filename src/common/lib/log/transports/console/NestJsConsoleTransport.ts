import { ConsoleLogger, LogLevel } from '@nestjs/common'
import { LogMessagePayload } from '@/common/lib/log/models/LogMessagePayload'
import { LogTransportBase } from '@/common/lib/log/transports/base/LogTransportBase'
import { LogTransportType } from '@/common/lib/log/enum/LogTransportType'

export class NestJsConsoleTransport extends LogTransportBase {
    private readonly consoleLogger: ConsoleLogger

    constructor() {
        super()
        this.consoleLogger = new ConsoleLogger()
    }

    getTransportType(): LogTransportType {
        return LogTransportType.Console
    }

    writeLog(info: LogMessagePayload): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message, context, level, labels, stack, firstLine, ...rest } = info

        const nestLevel = level === 'info' as LogLevel ? 'log' : level

        let resultMessage
        if (Object.keys(rest).length > 0 && message) {
            try {
                resultMessage = `${message} ${JSON.stringify(rest)}`
            } catch (err) {
                console.log(err)
            }
        } else if (message) {
            resultMessage = message
        } else {
            resultMessage = rest
        }

        const contextForLog = firstLine === true ? `~ ${context}` : context
        if (nestLevel === 'error') {
            this.consoleLogger.error(resultMessage, stack, contextForLog)
            return
        }

        this.consoleLogger[nestLevel](resultMessage, contextForLog)
    }
}
