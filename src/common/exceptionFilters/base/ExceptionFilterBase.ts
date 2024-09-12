import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { ArgumentHostHelper } from '@/common/lib/argumentHost/ArgumentHostHelper'
import { ErrorResponse } from '@/common/models/responses/ErrorResponse'
import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'
import { IResponseError } from '@/common/models/responses/errors/IResponseError'
import { LabeledRequestLogger } from '@/common/lib/log/loggers/LabeledRequestLogger'

export abstract class ExceptionFilterBase<T> implements ExceptionFilter<T> {
    constructor(private readonly criticalError = false) {
    }

    abstract getStatus(exception: T, request: ApiRequestData): HttpStatus

    abstract getError(exception: T, request: ApiRequestData): Promise<IResponseError>

    async catch(exception: T, host: ArgumentsHost): Promise<void> {
        const request = ArgumentHostHelper.getApiRequestData(host)
        const error = await this.getError(exception, request)
        const response = host.switchToHttp().getResponse()
        const body = new ErrorResponse(error, request.guid)
        response.status(this.getStatus(exception, request)).json(body)
        const logger = new LabeledRequestLogger()
        if (this.criticalError) {
            logger.logCriticalErrorResponse(host, body, exception)
        } else {
            logger.logHandledErrorResponse(host, body, exception)
        }
    }
}
