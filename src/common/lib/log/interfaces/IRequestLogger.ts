import { ArgumentsHost } from '@nestjs/common'

export interface IRequestLogger {
    logSuccessResponse(context: ArgumentsHost, responseData: Record<string, any>): void

    logHandledErrorResponse(context: ArgumentsHost, responseData: Record<string, any>, exception: Record<string, any>): void

    logCriticalErrorResponse(context: ArgumentsHost, responseData: Record<string, any>, exception: Record<string, any>): void
}
