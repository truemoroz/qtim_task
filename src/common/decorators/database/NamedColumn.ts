import { Column } from 'sequelize-typescript'
import { DataType, ModelAttributeColumnOptions } from 'sequelize'
import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'

export const NamedColumn = (dataType: DataType, columnName?: string, options?: Partial<ModelAttributeColumnOptions>): PropertyDecorator =>
    (target: QueryableModel, propertyKey: string) =>
        Column({ ...options, type: dataType, field: columnName || propertyKey })(target, propertyKey)
