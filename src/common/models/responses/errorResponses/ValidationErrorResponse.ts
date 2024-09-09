import { ErrorResponse } from '../ErrorResponse'
import { ValidationError } from '../errors/ValidationError'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class ValidationErrorResponse extends ErrorResponse {

    @FieldDescriptor({ example: false })
    success: boolean

    @FieldDescriptor({ type: () => ValidationError, description: 'Response error' })
    error: ValidationError
}
