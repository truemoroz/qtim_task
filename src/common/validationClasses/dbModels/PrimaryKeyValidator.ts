import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { ValidationError as ResponseValidationError } from '@/common/models/responses/errors/ValidationError'
import { ValidationException } from '@/common/exceptions/ValidationException'
import { QueryableModelCtor } from '@/common/lib/queryBuilder/models/QueryableModel'
import { ArrayHelper } from '@/common/lib/array/ArrayHelper'

@ValidatorConstraint({ name: 'PrimaryKeyValidator', async: true })
export class PrimaryKeyValidator implements ValidatorConstraintInterface {
    async validate(modelIds: number | number[], args?: ValidationArguments): Promise<boolean> {
        if (!args.constraints || args.constraints.length === 0) {
            return false
        }
        const model: QueryableModelCtor = args.constraints[0]
        const isArray = args.constraints[1]
        if (isArray) {
            if (!Array.isArray(modelIds)) {
                modelIds = [modelIds]
            }
            if (modelIds.filter(p => Number.isNaN(p)).length > 0) {
                return false
            }
            const result = await model.query()
                .select(['id'])
                .where({ [model.primaryKeyAttribute]: modelIds })
                .getAll()
            if (result.length != modelIds.length) {
                const resultMap = ArrayHelper.createMap(result, 'id')
                const error = new ResponseValidationError()
                for (let i = 0; i < modelIds.length; i++) {
                    const modelId = modelIds[i]
                    if (!resultMap[modelId]) {
                        error.addError(args.property, `Model "${model.name}" with id "${modelId}" not found`)
                    }
                }
                throw new ValidationException(error)
            }
        } else {
            const modelId = Array.isArray(modelIds) ? modelIds[0] : modelIds
            if (Number.isNaN(modelId)) {
                return false
            }
            const result = await model.findByPk(modelId, { useMaster: true })
            if (!result) {
                const error: ResponseValidationError = new ResponseValidationError()
                error.setFieldError(args.property, [`Model "${model.name}" with id "${modelIds}" not found`])
                throw new ValidationException(error)
            }
        }
        return true
    }
}
