import { applyDecorators } from '@nestjs/common'
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { ApiProperty } from '@nestjs/swagger'
import {
    ArrayMaxSize,
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsIn,
    IsInt,
    IsNegative,
    IsNotEmpty,
    IsNotIn,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator'
import { Type } from 'class-transformer'
import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'
import { IsPrimaryKey } from '@/common/decorators/validation/dbModels/IsPrimaryKey'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { TransformToBoolean } from '@/common/decorators/validation/transform/TransformToBoolean'
import { TransformToDate } from '@/common/decorators/validation/transform/TransformToDate'

export type ModelFieldOptions = ApiPropertyOptions & {
    [key: string]: any
    type?: () => Function
    integerValue?: boolean
    booleanValue?: boolean
    stringValue?: boolean
    dateValue?: boolean
    objectValue?: boolean
    isNotEmpty?: boolean
    isPrimaryKeyOf?: () => Constructor<QueryableModel>
    isNegative?: boolean
    isPositive?: boolean
    notin?: Array<any>
    in?: Array<any>
}

const flagDecoratorGroups: Partial<Record<keyof ModelFieldOptions, () => PropertyDecorator[]>> = {
    integerValue: () => [IsInt(), Type(() => Number)],
    booleanValue: () => [TransformToBoolean(), IsBoolean()],
    stringValue: () => [IsString(), Type(() => String)],
    dateValue: () => [TransformToDate(), IsDate()],
    objectValue: () => [IsObject()],
}

const parametrizedDecorators: Partial<Record<keyof ModelFieldOptions, (param: any) => PropertyDecorator>> = {
    minimum: Min,
    maximum: Max,
    minLength: MinLength,
    maxLength: MaxLength,
    notin: IsNotIn,
    in: IsIn,
    maxItems: ArrayMaxSize,
}

const flagDecorators: Partial<Record<keyof ModelFieldOptions, () => PropertyDecorator>> = {
    isArray: IsArray,
    isNotEmpty: IsNotEmpty,
    isNegative: IsNegative,
    isPositive: IsPositive,
}

export const FieldDescriptor: (options: ModelFieldOptions) => PropertyDecorator = (options: ModelFieldOptions) => applyDecorators(
    (target: any, propertyKey: string): void => {
        if (options.integerValue) {
            options.type = (): (() => number) => Number
        }
        if (options.dateValue) {
            options.type = (): (() => string) => Date
        }
        if (options.booleanValue) {
            options.type = (): (() => boolean) => Boolean
        }
        ApiProperty(options)(target, propertyKey)
        const decorators: PropertyDecorator[] = []
        if (options) {
            const optionKeys = Object.keys(options)
            for (let i = 0; i < optionKeys.length; i++) {
                const key = optionKeys[i]
                const optionValue = options[key]
                if (parametrizedDecorators[key]) {
                    decorators.push(parametrizedDecorators[key](optionValue))
                }
                if (flagDecorators[key]) {
                    decorators.push(flagDecorators[key]())
                }
                if (flagDecoratorGroups[key]) {
                    decorators.push(...flagDecoratorGroups[key]())
                }
            }

            if (options.required === false) {
                decorators.push(IsOptional())
            }

            if (options.type) {
                if (options.type() !== Boolean) {
                    decorators.push(Type(options.type))
                }
                const type = options.type()
                switch (type) {
                    case String:
                        decorators.push(IsString({ each: !!options.isArray }))
                        break
                    case Number:
                        decorators.push(IsNumber({}, { each: !!options.isArray }))
                        break
                    case Object:
                        decorators.push(IsObject({ each: !!options.isArray }))
                        break
                }
            }

            if (options.isPrimaryKeyOf) {
                const model = options.isPrimaryKeyOf()
                decorators.push(IsPrimaryKey(model, options.isArray))
            }

            if (options.enum) {
                decorators.push(IsEnum(options.enum, { each: true }))
            }
        }
        applyDecorators(...decorators)(target, propertyKey)
    },
)
