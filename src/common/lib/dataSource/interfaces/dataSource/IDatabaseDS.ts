import { Model } from 'sequelize-typescript'
import { MAttributes } from '@/common/lib/queryBuilder/DBModelQuery'
import { AttributeValueType } from '@/common/lib/dataSource/base/QueryableDSBase'
import { Identifier } from 'sequelize'

export interface IDatabaseDS<TModel extends Model, TContext> {
    getAllByField(context: TContext, field: MAttributes<TModel>, value: AttributeValueType): Promise<TModel[]>

    getAllByFieldPaginated(context: TContext, field: MAttributes<TModel>, value: AttributeValueType, limit: number, offset: number): Promise<TModel[]>

    getOneByField(context: TContext, field: MAttributes<TModel>, value: AttributeValueType): Promise<TModel>

    getByPk(context: TContext, pk: Identifier): Promise<TModel>
}
