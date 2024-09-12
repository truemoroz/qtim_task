import { Catch, HttpStatus } from '@nestjs/common'
import { BaseError } from '../models/responses/errors/BaseError'
import { ApiException } from '../exceptions/ApiException'
import { ExceptionFilterBase } from '@/common/exceptionFilters/base/ExceptionFilterBase'
import { IResponseError } from '@/common/models/responses/errors/IResponseError'
import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'


@Catch(ApiException)
export class ApiExceptionFilter extends ExceptionFilterBase<ApiException> {
    constructor() {
        super()
    }

    async getError(exception: ApiException, request: ApiRequestData): Promise<IResponseError> {
        let code = exception.code
        const namespace = new exception.ns()
        if (namespace.codeSpace) {
            code += namespace.codeSpace
        }
        const error = new BaseError(
            code,
            JSON.stringify(exception.data),
        )
        error.setData(exception.data)
        return error
    }

    getStatus(exception: ApiException): HttpStatus {
        return exception.getStatus()
    }
}
