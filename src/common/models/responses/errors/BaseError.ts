import { IResponseError } from './IResponseError'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class BaseError implements IResponseError {

    @FieldDescriptor({ example: 1000, description: 'Error code' })
    code: number

    @FieldDescriptor({ example: 'default', description: 'Error type' })
    type = 'default'

    @FieldDescriptor({ example: '' })
    description: string

    @FieldDescriptor({ example: {}, description: 'Additional data' })
    data: Record<string, any>

    constructor(code: number, description?: string) {
        this.code = code
        this.description = description
    }

    setData(data: Record<string, any>): void {
        this.data = data
    }
}
