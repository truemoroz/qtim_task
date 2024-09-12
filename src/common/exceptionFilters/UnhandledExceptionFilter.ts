import { Catch, HttpStatus } from '@nestjs/common'
import { CriticalError } from '@/common/models/responses/errors/CriticalError'
import { ExceptionFilterBase } from '@/common/exceptionFilters/base/ExceptionFilterBase'
import { IResponseError } from '@/common/models/responses/errors/IResponseError'

@Catch(Error)
export class UnhandledExceptionFilter extends ExceptionFilterBase<Error> {
    constructor() {
        super(true)
    }

    async getError(exception: Error): Promise<IResponseError> {
        return new CriticalError(HttpStatus.INTERNAL_SERVER_ERROR, exception.message)
    }

    getStatus(): HttpStatus {
        return HttpStatus.INTERNAL_SERVER_ERROR
    }
}
