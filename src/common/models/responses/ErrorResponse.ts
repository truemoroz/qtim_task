import { ResponseModel } from './ResponseModel'
import { IResponseError } from './errors/IResponseError'

export class ErrorResponse extends ResponseModel<never, IResponseError> {
    constructor(error: IResponseError, requestId?: string) {
        super()
        this.success = false
        this.error = error
        this.requestId = requestId
    }
}
