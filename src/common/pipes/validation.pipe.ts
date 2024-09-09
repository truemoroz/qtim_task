import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate, ValidationError as ClassValidatorValidationError } from 'class-validator'
import { ValidationException } from '../exceptions/ValidationException'
import { ValidationError } from '@/common/models/responses/errors/ValidationError'
import { ValidatorOptions } from 'class-validator/types/validation/ValidatorOptions'


export type FieldValidationErrorInfo = {
    field: string,
    descriptions?: string[],
    innerErrors?: FieldValidationErrorInfo[]
}

@Injectable()
export class ValidationPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (metadata.type === 'custom') {
            return value
        }
        const obj = plainToInstance(metadata.metatype, value)
        if (['number', 'string'].indexOf(typeof obj) !== -1) {
            return obj
        }

        await ValidationPipe.validateInstance(obj)

        return obj
    }

    public static async validateInstance<T extends object>(obj: T, options?: ValidatorOptions): Promise<void> {
        const errors = await validate(obj, options)
        const fieldErrorInfo = this.makeFieldValidationErrorInfo(errors)
        this.throwValidationErrorsIfExists(fieldErrorInfo)
    }

    public static async validateInstanceArray<T extends object>(objs: T[], options?: ValidatorOptions): Promise<void> {
        for (const obj of objs) {
            const errors = await validate(obj, options)
            const fieldErrorInfo = this.makeFieldValidationErrorInfo(errors)
            this.throwValidationErrorsIfExists(fieldErrorInfo)
        }
    }

    public static makeFieldValidationErrorInfo(
        errors: ClassValidatorValidationError[],
        parentPath = ''): FieldValidationErrorInfo[] {
        const result: FieldValidationErrorInfo[] = []
        for (let i = 0; i < errors.length; i++) {
            const error = errors[i]
            if (error.constraints) {
                const fieldErrorInfo: FieldValidationErrorInfo = {
                    field: parentPath ? `${parentPath}.${error.property}` : error.property,
                    descriptions: Object.values(error.constraints),
                }
                result.push(fieldErrorInfo)
            }

            if (error.children) {
                result.push(...this.makeFieldValidationErrorInfo(error.children, error.property))
            }
        }
        return result
    }

    public static throwValidationErrorsIfExists(errors: FieldValidationErrorInfo[]): void {
        if (errors.length) {
            const error: ValidationError = new ValidationError()
            for (let i = 0; i < errors.length; i++) {
                const err = errors[i]
                error.setFieldError(err.field, err.descriptions)
            }
            throw new ValidationException(error)
        }
    }
}
