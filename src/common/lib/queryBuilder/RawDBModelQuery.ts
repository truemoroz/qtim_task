import { DBModelQuery } from '@/common/lib/queryBuilder/DBModelQuery'
import { Identifier } from 'sequelize/dist/lib/model'
import { QueryableModel, QueryableModelCtor } from '@/common/lib/queryBuilder/models/QueryableModel'
import { RawSequelizeModel, RawSqlResult } from '@/common/lib/queryBuilder/raw/RawSequelizeModel'

export class RawDBModelQuery<M extends QueryableModel> {

    private readonly rawModel: RawSequelizeModel<M>

    constructor(
        private readonly modelQuery: DBModelQuery<M>,
        private readonly model: QueryableModelCtor<M>,
    ) {
        this.rawModel = new RawSequelizeModel<M>(model)
    }

    public async getAll(tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        return this.rawModel.findAll(this.modelQuery.getRawQueryOptions(), tableName, tableAlias)
    }

    public async getOne(tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        return this.rawModel.findOne(this.modelQuery.getRawQueryOptions(), tableName, tableAlias)
    }

    public async getByPk(identifier?: Identifier, tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        return this.rawModel.findByPk(identifier, this.modelQuery.getRawQueryOptions(), tableName, tableAlias)
    }

    public async count(distinct = true, tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        return this.rawModel.count({ ...this.modelQuery.getRawQueryOptions(), distinct }, tableName, tableAlias)
    }
}
