import { IResponseError } from '@/common/models/responses/errors/IResponseError'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class CriticalError implements IResponseError {
    @FieldDescriptor({ example: 500, description: 'Error code' })
    code: number

    @FieldDescriptor({ example: 'default', description: 'Error type' })
    type = 'critical'

    @FieldDescriptor({ example: '' })
    description: string

    constructor(code: number, description?: string) {
        this.code = code
        this.description = description
    }
}
