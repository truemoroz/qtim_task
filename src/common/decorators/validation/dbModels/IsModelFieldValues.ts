import { Model } from 'sequelize-typescript'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { registerDecorator, ValidationOptions } from 'class-validator'
import { ModelFieldValueValidator } from '@/common/validationClasses/dbModels/ModelFieldValueValidator'

export function IsModelFieldValues<TModel extends Model>(
    model: Constructor<TModel>,
    field: keyof TModel,
    validationOptions?: ValidationOptions): PropertyDecorator
{
    return function(object: Array<any>, propertyName: string) {
        registerDecorator({
            name: 'ModelFieldValueValidator',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [model, field],
            options: validationOptions,
            validator: ModelFieldValueValidator,
        })
    }
}
