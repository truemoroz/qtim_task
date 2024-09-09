import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { ValidationError as ResponseValidationError } from '@/common/models/responses/errors/ValidationError'
import { ValidationException } from '@/common/exceptions/ValidationException'
import { QueryableModelCtor } from '@/common/lib/queryBuilder/models/QueryableModel'
import { Sequelize } from 'sequelize-typescript'

@ValidatorConstraint({ async: true })
export class ModelFieldValueValidator implements ValidatorConstraintInterface {
    async validate(values: string[], args?: ValidationArguments): Promise<boolean> {
        if (!args.constraints || args.constraints.length === 0 || args.constraints.length < 2) {
            return false
        }
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
        const model: QueryableModelCtor = args.constraints[0]
        const field = args.constraints[1]

        values = [...new Set(values)]

        const result = await model.query()
            .where({
                [field]: values,
            })
            .select([[Sequelize.literal(`DISTINCT "${field}"`), field]])
            .getAll()

        if (result.length < values.length) {
            const map: Record<string, any> = {}

            for (let i = 0; i < result.length; i++) {
                map[result[i][field as keyof typeof result[typeof i]]] = result[i]
            }

            for (let i = 0; i < values.length; i++) {
                if (map[values[i]]) {
                    values.splice(i, 1)
                    i--
                }
            }

            if (values.length > 0) {
                const error: ResponseValidationError = new ResponseValidationError()
                const errors = values.map(p => `The "${model.name}" model does not contain the value "${args.property} = ${p}"`)
                error.setFieldError(args.property, errors)
                throw new ValidationException(error)
            }
        }
        return true
    }
}
