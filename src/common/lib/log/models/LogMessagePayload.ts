import { LogLevel } from '@nestjs/common'

export class LogMessagePayload {
    message: string
    level: LogLevel
    stack: Array<any>
    context: string
    labels: Record<string, any>
    firstLine = true
}
