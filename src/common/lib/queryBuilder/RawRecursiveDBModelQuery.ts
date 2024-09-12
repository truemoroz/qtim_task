import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'
import { RawSqlResult } from '@/common/lib/queryBuilder/raw/RawSequelizeModel'
import { RecursiveDBModelQuery } from '@/common/lib/queryBuilder/RecursiveDBModelQuery'
import { Identifier } from 'sequelize'

export class RawRecursiveDBModelQuery<M extends QueryableModel> {
    constructor(
        private readonly recursiveModelQuery: RecursiveDBModelQuery<M>,
    ) {
    }

    public async getAll(tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        return this.recursiveModelQuery.getAllSql(tableAlias, tableName)
    }

    public async getOne(tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        return this.recursiveModelQuery.getOneSql(tableAlias, tableName)
    }

    public async getByPk(identifier?: Identifier, tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        return this.recursiveModelQuery.getByPKSql(identifier, tableAlias, tableName)
    }

    public async count(distinct = true, tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        return this.recursiveModelQuery.countSql(distinct, tableAlias, tableName)
    }
}
