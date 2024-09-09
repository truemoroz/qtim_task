import { SuccessResponse } from '@/common/models/responses/SuccessResponse'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class PaginationPayload<T> {
    list: T[]

    @FieldDescriptor({ example: 100, description: 'Total number of records' })
    total: number

    constructor(list: T[], total: number) {
        this.list = list
        this.total = total
    }
}

export class PaginationResponse<TResponse> extends SuccessResponse<PaginationPayload<TResponse>> {

    payload: PaginationPayload<TResponse>

    constructor(payload: PaginationPayload<TResponse>) {
        super()
        this.payload = payload
    }
}
