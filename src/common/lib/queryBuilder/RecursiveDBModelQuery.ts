import { DBModelQuery, MAttributes } from '@/common/lib/queryBuilder/DBModelQuery'
import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'
import { DataTypes, Identifier, QueryTypes, WhereOptions } from 'sequelize'
import _ from 'lodash'
import { RawSqlResult } from '@/common/lib/queryBuilder/raw/RawSequelizeModel'
import { QueryGeneratorHelper } from '@/common/lib/sequelize/queryGenerator/QueryGeneratorHelper'
import { RawRecursiveDBModelQuery } from '@/common/lib/queryBuilder/RawRecursiveDBModelQuery'

export class RecursiveDBModelQuery<M extends QueryableModel> extends DBModelQuery<M> {

    private static readonly TempTableName = 'cte_temp_table'

    private anchorQuery: DBModelQuery<any>
    private baseQuery: DBModelQuery<any>

    private parentColumn: keyof MAttributes<M>
    private baseColumn: keyof MAttributes<M>
    private recursiveWhere: WhereOptions<MAttributes<M>>

    public anchor(query: DBModelQuery<any>): RecursiveDBModelQuery<M> {
        this.anchorQuery = query
        return this
    }

    public query(query: DBModelQuery<any>): RecursiveDBModelQuery<M> {
        this.baseQuery = query
        return this
    }

    public on(parentColumn: keyof MAttributes<M>, baseColumn: keyof MAttributes<M>, where: WhereOptions<MAttributes<M>> = {}): RecursiveDBModelQuery<M> {
        this.parentColumn = parentColumn
        this.baseColumn = baseColumn
        this.recursiveWhere = where
        return this
    }

    public async count(distinct = true): Promise<number> {
        return this.recursiveCount(distinct)
    }

    public async getOne(): Promise<M> {
        const query = await this.getOneSql(null, RecursiveDBModelQuery.TempTableName)
        return this.recursiveFind(query)
    }

    public async getAll(): Promise<M[]> {
        const query = await this.getAllSql(null, RecursiveDBModelQuery.TempTableName)
        return this.recursiveFind(query)
    }

    public async getByPK(identifier: Identifier): Promise<M> {
        const query = await this.getByPKSql(identifier, null, RecursiveDBModelQuery.TempTableName)
        return this.recursiveFind(query)
    }


    public async getAllSql(tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        const baseQuery = await this.asSql().getAll(tableAlias, tableName || RecursiveDBModelQuery.TempTableName)
        return this.makeRecursiveQuery(baseQuery)
    }

    public async getByPKSql(identifier?: Identifier, tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        this.resultQueryData.where = {
            [this.model.primaryKeyAttribute]: identifier,
        } as any
        const baseQuery = await this.asSql().getByPk(identifier, tableAlias, tableName || RecursiveDBModelQuery.TempTableName)
        return this.makeRecursiveQuery(baseQuery)
    }

    public async getOneSql(tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        const baseQuery = await this.asSql().getOne(tableAlias, tableName || RecursiveDBModelQuery.TempTableName)
        return this.makeRecursiveQuery(baseQuery)
    }

    public async countSql(distinct = true, tableAlias?: string, tableName?: string): Promise<RawSqlResult> {
        const recursiveQueryClause = await this.getRawRecursiveClause()
        const rawSqlResult = await this.asSql().count(distinct, tableAlias, tableName || RecursiveDBModelQuery.TempTableName)
        const query = `${recursiveQueryClause} ${rawSqlResult.query}`
        return {
            query,
            options: rawSqlResult.options,
        }
    }

    public asRecursiveSql(): RawRecursiveDBModelQuery<M> {
        return new RawRecursiveDBModelQuery(this)
    }


    private async recursiveFind<T>(sqlResult: RawSqlResult): Promise<T> {
        const options = sqlResult.options
        const model = this.model as any

        const results = await model.sequelize.query(sqlResult.query, {
            ...options,
            type: QueryTypes.SELECT,
            model,
        })
        if (options.hooks) {
            await model.runHooks('afterFind', results, options)
        }
        //rejectOnEmpty mode
        if (_.isEmpty(results) && options.rejectOnEmpty) {
            if (typeof options.rejectOnEmpty === 'function') {
                throw new options.rejectOnEmpty()
            }
            if (typeof options.rejectOnEmpty === 'object') {
                throw options.rejectOnEmpty
            }
            throw new Error('Empty result')
        }
        return await model._findSeparate(results, options)
    }

    private async recursiveCount(distinct = true): Promise<any> {
        const model = this.model as any

        const recursiveQueryClause = await this.getRawRecursiveClause()
        const rawSqlResult = await this.asSql().count(distinct, null, RecursiveDBModelQuery.TempTableName)
        const query = `${recursiveQueryClause} ${rawSqlResult.query}`

        const data = await model.sequelize.query(query, {
            ...rawSqlResult.options,
            type: QueryTypes.SELECT,
            model,
        })

        return this.prepareCountResult(rawSqlResult.options, data)
    }

    private async makeRecursiveQuery(baseQuery: RawSqlResult): Promise<RawSqlResult> {
        const recursiveQueryClause = await this.getRawRecursiveClause()
        return {
            query: `${recursiveQueryClause} ${baseQuery.query}`,
            options: baseQuery.options,
        }
    }

    private prepareCountResult(options: Record<string, any>, data: Record<string, any>): any {
        const attributeSelector = 'count'

        if (!options.plain) {
            return data
        }

        const result = data ? data[attributeSelector] : null

        if (!options || !options.dataType) {
            return result
        }

        const dataType = options.dataType

        if (dataType instanceof DataTypes.DECIMAL || dataType instanceof DataTypes.FLOAT) {
            if (result !== null) {
                return parseFloat(result)
            }
        }
        if (dataType instanceof DataTypes.INTEGER || dataType instanceof DataTypes.BIGINT) {
            if (result !== null) {
                return parseInt(result, 10)
            }
        }
        if (dataType instanceof DataTypes.DATE) {
            if (result !== null && !(result instanceof Date)) {
                return new Date(result)
            }
        }

        if (result != null && Array.isArray(result)) {
            return result.map(item => ({
                ...item,
                count: Number(item.count),
            }))
        }

        return result
    }

    private async getRawRecursiveClause(): Promise<string> {
        const anchor = await this.anchorQuery.asSql().getAll(this.model.name + '__temp_1')
        const base = await this.baseQuery.asSql().getAll(this.model.name + '__temp_2')

        let query = `WITH RECURSIVE "${RecursiveDBModelQuery.TempTableName}" AS (`
        query += anchor.query
        query += ' UNION ALL '
        query += base.query
        query += ` INNER JOIN "${RecursiveDBModelQuery.TempTableName}" ON ("${RecursiveDBModelQuery.TempTableName}"."${this.parentColumn.toString()}" = "${this.model.name + '__temp_2'}"."${this.baseColumn.toString()}") `

        let whereLiteral = ''
        if (this.recursiveWhere) {
            const queryGenerator = QueryGeneratorHelper.getQueryGenerator(this.model)
            whereLiteral = queryGenerator.whereQuery(this.recursiveWhere, { prefix: this.model.name + '__temp_2' })
        }

        query += whereLiteral
        query += ' )'

        return query
    }
}
