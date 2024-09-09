import { IResponseError } from './IResponseError'
import { ApiProperty } from '@nestjs/swagger'

export class ValidationError implements IResponseError {

    @ApiProperty({ example: 400, description: 'Error code' })
    code = 400

    @ApiProperty({ example: 'validation', description: 'Error type' })
    type = 'validation'

    @ApiProperty({ example: { fieldName: ['error description'] }, description: 'Request fields errors' })
    fields: Record<string, any>

    constructor(fields?: Record<string, any>) {
        this.fields = fields ?? {}
    }

    setFieldError(name: string, errors: string[]): void {
        this.fields[name] = errors
    }

    addError(name: string, error: string): void {
        if (this.fields[name] === undefined) {
            this.fields[name] = []
        }
        this.fields[name].push(error)
    }
}
