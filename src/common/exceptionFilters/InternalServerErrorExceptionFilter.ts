import { Catch, HttpStatus, InternalServerErrorException } from '@nestjs/common'
import { CriticalError } from '@/common/models/responses/errors/CriticalError'
import { ExceptionFilterBase } from '@/common/exceptionFilters/base/ExceptionFilterBase'
import { IResponseError } from '@/common/models/responses/errors/IResponseError'


@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter extends ExceptionFilterBase<InternalServerErrorException> {
    constructor() {
        super(true)
    }

    async getError(): Promise<IResponseError> {
        return new CriticalError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
    }

    getStatus(): HttpStatus {
        return HttpStatus.INTERNAL_SERVER_ERROR
    }
}
