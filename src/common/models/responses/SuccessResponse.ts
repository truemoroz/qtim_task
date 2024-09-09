import { ResponseModel } from './ResponseModel'

export class SuccessResponse<T> extends ResponseModel<T, never> {
    constructor(payload?: T) {
        super()
        this.success = true
        this.payload = payload
    }
}
