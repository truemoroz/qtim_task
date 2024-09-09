import { registerDecorator, ValidationOptions } from 'class-validator'
import { PrimaryKeyValidator } from '@/common/validationClasses/dbModels/PrimaryKeyValidator'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'

export function IsPrimaryKey(model: Constructor<QueryableModel>, isArray = false, validationOptions?: ValidationOptions): PropertyDecorator {
    return function(object: Record<string, any>, propertyName: string) {
        registerDecorator({
            name: 'PrimaryKeyValidator',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [model, isArray],
            options: validationOptions,
            validator: PrimaryKeyValidator,
        })
    }
}
