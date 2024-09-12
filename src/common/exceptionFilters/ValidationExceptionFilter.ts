import { Catch, HttpStatus } from '@nestjs/common'
import { ValidationException } from '../exceptions/ValidationException'
import { ExceptionFilterBase } from '@/common/exceptionFilters/base/ExceptionFilterBase'
import { IResponseError } from '@/common/models/responses/errors/IResponseError'

@Catch(ValidationException)
export class ValidationExceptionFilter extends ExceptionFilterBase<ValidationException> {

    async getError(exception: ValidationException): Promise<IResponseError> {
        return exception.error
    }

    getStatus(): HttpStatus {
        return HttpStatus.BAD_REQUEST
    }
}
