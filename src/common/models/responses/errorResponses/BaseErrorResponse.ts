import { ErrorResponse } from '../ErrorResponse'
import { BaseError } from '../errors/BaseError'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class BaseErrorResponse extends ErrorResponse {

    @FieldDescriptor({ example: false })
    success: boolean

    @FieldDescriptor({ type: () => BaseError, description: 'Response error' })
    error: BaseError
}
