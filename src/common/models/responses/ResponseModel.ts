import { Uuid } from '@/common/lib/uuid/Uuid'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'
import { ApiResponseBase } from '@/common/models/responses/ApiResponseBase'

export class ResponseModel<TPayload, TError> extends ApiResponseBase {
    @FieldDescriptor({ example: true, description: 'Request result' })
    success: boolean

    @FieldDescriptor({ example: Uuid.empty(), description: 'Request id' })
    requestId: string

    payload: TPayload = null
    error: TError = null

    static getSuccess<T>(data?: T): ResponseModel<T, never> {
        const res = new ResponseModel<T, never>()
        res.success = true
        res.payload = data
        return res
    }

    static getError<T>(error: T): ResponseModel<never, T> {
        const res = new ResponseModel<never, T>()
        res.success = true
        res.error = error
        return res
    }
}
