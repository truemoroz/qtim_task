import { IDataSource } from '@/common/lib/dataSource/interfaces/dataSource/IDataSource'
import { Model } from 'sequelize-typescript'
import { DBModelQuery, MAttributes } from '@/common/lib/queryBuilder/DBModelQuery'
import { IDatabaseDS } from '@/common/lib/dataSource/interfaces/dataSource/IDatabaseDS'
import { Identifier } from 'sequelize'

export type AttributeValueType = Identifier | Record<string, any> | boolean

export abstract class QueryableDSBase<TModel extends Model, TContext> implements IDataSource<TModel, TContext>, IDatabaseDS<TModel, TContext> {

    constructor(
        protected readonly useMaster = false,
    ) {
    }

    public abstract getQuery(context: TContext): Promise<DBModelQuery<TModel>>

    public abstract getEmptyContext(): Promise<TContext>

    public async getPaginateQuery(context: TContext, limit: number, offset: number): Promise<DBModelQuery<TModel>> {
        return (await this.makeQuery(context)).limit(limit).offset(offset)
    }

    public async getQueryByField(context: TContext, field: MAttributes<TModel>, value: AttributeValueType): Promise<DBModelQuery<TModel>> {
        return (await this.makeQuery(context)).where({
          [field]: { val: value },
        })
    }

    public async countAll(context: TContext, distinct = true): Promise<number> {
        return (await this.makeQuery(context)).count(distinct)
    }

    public async getAll(context: TContext): Promise<TModel[]> {
        return (await this.makeQuery(context)).getAll()
    }

    public async getAllPaginated(context: TContext, limit: number, offset: number): Promise<TModel[]> {
        return (await this.getPaginateQuery(context, limit, offset)).getAll()
    }

    public async getOne(context: TContext): Promise<TModel> {
        return (await this.makeQuery(context)).getOne()
    }

    public async getAllByField(context: TContext, field: MAttributes<TModel>, value: AttributeValueType): Promise<TModel[]> {
        return (await this.getQueryByField(context, field, value)).getAll()
    }

    public async getAllByFieldPaginated(context: TContext, field: MAttributes<TModel>, value: AttributeValueType, limit: number, offset: number): Promise<TModel[]> {
        return (await this.getQueryByField(context, field, value)).limit(limit).offset(offset).getAll()
    }

    public async getByPk(context: TContext, pk: Identifier): Promise<TModel> {
        return (await this.makeQuery(context)).getByPK(pk)
    }

    public async getOneByField(context: TContext, field: MAttributes<TModel>, value: AttributeValueType): Promise<TModel> {
        return (await this.getQueryByField(context, field, value)).getOne()
    }

    private async makeQuery(context: TContext): Promise<DBModelQuery<TModel>> {
        const query = await this.getQuery(context)
        if (this.useMaster) {
            return query.useMaster()
        }
        return query.useReplica()
    }
}
