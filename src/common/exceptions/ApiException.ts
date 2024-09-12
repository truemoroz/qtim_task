import { HttpException, HttpStatus } from '@nestjs/common'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { IExceptionNS } from '@/common/exceptions/interfaces/IExceptionNS'

export class ApiException extends HttpException {
    readonly code: number = 0
    readonly errorName: string = ''
    readonly ns: Constructor<IExceptionNS>
    params?: Record<string, any>
    data: Record<string, any>
    public readonly baseException: Error

    constructor(baseException?: Error, status: HttpStatus = HttpStatus.BAD_REQUEST) {
        super(null, status)
        if (baseException) {
            this.data = {
                message: baseException.message,
            }
        }
        this.baseException = baseException
    }

}
