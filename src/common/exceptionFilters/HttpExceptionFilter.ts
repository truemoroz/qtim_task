import { Catch, HttpException, HttpStatus } from '@nestjs/common'
import { BaseError } from '../models/responses/errors/BaseError'
import { ExceptionFilterBase } from '@/common/exceptionFilters/base/ExceptionFilterBase'
import { IResponseError } from '@/common/models/responses/errors/IResponseError'

@Catch(HttpException)
export class HttpExceptionFilter extends ExceptionFilterBase<HttpException> {
    async getError(exception: HttpException): Promise<IResponseError> {
        const error = new BaseError(exception.getStatus())
        const errorResponse = exception.getResponse() as Record<string, any>
        if (typeof errorResponse === 'string') {
            error.description = errorResponse
        } else if (errorResponse['message']) {
            error.description = errorResponse['message']
        } else {
            error.setData(errorResponse)
        }
        return error
    }

    getStatus(exception: HttpException): HttpStatus {
        return exception.getStatus()
    }
}
