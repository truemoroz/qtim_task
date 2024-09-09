import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { ModelCtor } from 'sequelize-typescript'
import { ValidationError as ResponseValidationError } from '@/common/models/responses/errors/ValidationError'
import { ValidationException } from '@/common/exceptions/ValidationException'

@ValidatorConstraint({ async: true })
export class NotModelFieldValueValidator implements ValidatorConstraintInterface {
    async validate(value: string[], args?: ValidationArguments): Promise<boolean> {
        if (!args.constraints || args.constraints.length === 0 || args.constraints.length < 2) {
            return false
        }

        const values = this.parseValues(value)
        const model: ModelCtor = args.constraints[0]
        const field = args.constraints[1]

        const result = await model.findOne({
            where: {
                [field]: values,
            },
        })

        if (result === null) {
            return true
        }

        const error: ResponseValidationError = new ResponseValidationError()
        error.setFieldError(
            args.property,
            [`The "${model.name}" model already contain the value "${args.property} = ${result[field as keyof typeof result]}"`],
        )

        throw new ValidationException(error)
    }

    parseValues(values: string | string[]): string[] {
        if (!Array.isArray(values)) {
            if (['string', 'number'].indexOf(typeof values) > -1) {
                values = [values]
            } else {
                try {
                    values = Object.values(values)
                } catch (err) {
                    values = [values.toString()]
                }
            }
        }

        return [...new Set(values)]
    }

}
