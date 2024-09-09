import { Model } from 'sequelize-typescript'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { registerDecorator, ValidationOptions } from 'class-validator'
import { NotModelFieldValueValidator } from '@/common/validationClasses/dbModels/NotModelFieldValueValidator'

export function IsNotModelFieldValues<TModel extends Model>(
    model: Constructor<TModel>,
    field: keyof TModel,
    validationOptions?: ValidationOptions): PropertyDecorator
{
    return function (object: Array<any>, propertyName: string) {
        registerDecorator({
            name: 'IsNotModelFieldValues',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [model, field],
            options: validationOptions,
            validator: NotModelFieldValueValidator,
            },
        )
    }
}
