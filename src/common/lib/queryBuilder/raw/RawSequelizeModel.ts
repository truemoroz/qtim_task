import { DataTypes, Sequelize, Utils } from 'sequelize'
import { inferAlias } from 'sequelize-typescript/dist/associations/alias-inference/alias-inference-service'
import _ from 'lodash'
import { QueryGeneratorHelper } from '@/common/lib/sequelize/queryGenerator/QueryGeneratorHelper'
import { AggregateOptions, CountOptions, FindOptions, Identifier } from 'sequelize/dist/lib/model'
import { Model, ModelCtor } from 'sequelize-typescript'

export type RawSqlResult = {
    query: string
    options: Record<string, any>
}

export class RawSequelizeModel<M extends Model> {
    private readonly model: any

    constructor(model: ModelCtor<M>) {
        this.model = model
    }

    public async findByPk(param?: Identifier, opts?: Omit<FindOptions<M['_attributes']>, 'where'>, tableName?: string, tableAlias?: string): Promise<RawSqlResult> {
        if ([null, undefined].includes(param)) {
            return null
        }

        let options = opts as any

        options = Utils.cloneDeep(options) || {}

        if (typeof param === 'number' || typeof param === 'string' || Buffer.isBuffer(param)) {
            options.where = {
                [this.model.primaryKeyAttribute]: param,
            }
        } else {
            throw new Error(`Argument passed to findByPk is invalid: ${param}`)
        }

        // Bypass a possible overloaded findOne
        return await this.findOne(options, tableName, tableAlias)
    }

    public async findOne(opts?: FindOptions<M['_attributes']>, tableName?: string, tableAlias?: string): Promise<RawSqlResult> {
        let options = opts as any

        if (options !== undefined && !_.isPlainObject(options)) {
            throw new Error('The argument passed to findOne must be an options object, use findByPk if you wish to pass a single primary key value')
        }
        options = Utils.cloneDeep(options)

        if (options.limit === undefined) {
            const uniqueSingleColumns = _.chain(this.model.uniqueKeys).values().filter(c => c.fields.length === 1).map('column').value()

            // Don't add limit if querying directly on the pk or a unique column
            if (!options.where || !_.some(options.where, (value, key) =>
                (key === this.model.primaryKeyAttribute || uniqueSingleColumns.includes(key)) &&
                (Utils.isPrimitive(value) || Buffer.isBuffer(value)),
            )) {
                options.limit = 1
            }
        }

        // Bypass a possible overloaded findAll.
        return await this.findAll(_.defaults(options, {
            plain: true,
        }), tableName, tableAlias)
    }

    public async findAll(opts?: FindOptions<M['_attributes']>, tableName?: string, tableAlias?: string): Promise<RawSqlResult> {
        let options = inferAlias(opts as any, this.model)

        if (options !== undefined && !_.isPlainObject(options)) {
            throw new Error('The argument passed to findAll must be an options object, use findByPk if you wish to pass a single primary key value')
        }

        if (options !== undefined && options.attributes) {
            if (!Array.isArray(options.attributes) && !_.isPlainObject(options.attributes)) {
                throw new Error('The attributes option must be an array of column names or an object')
            }
        }

        this.model.warnOnInvalidOptions(options, Object.keys(this.model.rawAttributes ?? {}))

        const tableNames = {}

        tableNames[this.model.getTableName(options)] = true
        options = Utils.cloneDeep(options)

        _.defaults(options, { hooks: true })

        // set rejectOnEmpty option, defaults to model options
        options.rejectOnEmpty = Object.prototype.hasOwnProperty.call(options, 'rejectOnEmpty')
            ? options.rejectOnEmpty
            : this.model.options.rejectOnEmpty

        this.model._injectScope(options)

        if (options.hooks) {
            await this.model.runHooks('beforeFind', options)
        }
        this.model._conformIncludes(options, this.model)
        this.model._expandAttributes(options)
        this.model._expandIncludeAll(options)

        if (options.hooks) {
            await this.model.runHooks('beforeFindAfterExpandIncludeAll', options)
        }
        options.originalAttributes = this.model._injectDependentVirtualAttributes(options.attributes)

        if (options.include) {
            options.hasJoin = true

            this.model._validateIncludedElements(options, tableNames)

            // If we're not raw, we have to make sure we include the primary key for de-duplication
            if (
                options.attributes
                && !options.raw
                && this.model.primaryKeyAttribute
                && !options.attributes.includes(this.model.primaryKeyAttribute)
                && (!options.group || !options.hasSingleAssociation || options.hasMultiAssociation)
            ) {
                options.attributes = [this.model.primaryKeyAttribute].concat(options.attributes)
            }
        }

        if (!options.attributes) {
            options.attributes = Object.keys(this.model.rawAttributes)
            options.originalAttributes = this.model._injectDependentVirtualAttributes(options.attributes)
        }

        // whereCollection is used for non-primary key updates
        this.model.options.whereCollection = options.where || null

        Utils.mapFinderOptions(options, this.model)

        options = this.model._paranoidClause(this.model, options)

        const resultOptions = options

        if (options.hooks) {
            await this.model.runHooks('beforeFindAfterOptions', options)
        }

        options = this.prepareAttributes(options, tableAlias)
        options.dotNotation = true

        const queryGenerator = QueryGeneratorHelper.getQueryGenerator(this.model)

        return {
            query: queryGenerator.selectQuery(tableName || this.model.getTableName(), options, this.model).slice(0, -1),
            options: resultOptions,
        }
    }

    public async count(opts?: CountOptions<M['_attributes']>, tableName?: string, tableAlias?: string): Promise<RawSqlResult> {
        let options = Utils.cloneDeep(opts as any)

        options = inferAlias(options, this.model)

        options = _.defaults(options, { hooks: true })
        options.raw = true
        if (options.hooks) {
            await this.model.runHooks('beforeCount', options)
        }
        let col = options.col || '*'
        if (options.include) {
            col = `${tableAlias || this.model.name}.${options.col || this.model.primaryKeyField}`
        }
        if (options.distinct && col === '*') {
            col = this.model.primaryKeyField
        }
        options.plain = !options.group
        options.dataType = new DataTypes.INTEGER()
        options.includeIgnoreAttributes = false

        // No limit, offset or order for the options max be given to count()
        // Set them to null to prevent scopes setting those values
        options.limit = null
        options.offset = null
        options.order = null

        options.tableAs = tableAlias

        return await this.aggregate(col, 'count', options, tableName)
    }

    async aggregate<T>(attribute: keyof M['_attributes'] | '*',
                       aggregateFunction: string,
                       opts?: AggregateOptions<T, M['_attributes']>,
                       tableName?: string): Promise<RawSqlResult> {
        let options = Utils.cloneDeep(opts as any)

        // We need to preserve attributes here as the `injectScope` call would inject non aggregate columns.
        const prevAttributes = options.attributes
        this.model._injectScope(options)
        options.attributes = prevAttributes
        this.model._conformIncludes(options, this.model)

        if (options.include) {
            this.model._expandIncludeAll(options)
            this.model._validateIncludedElements(options)
        }

        const attrOptions = this.model.rawAttributes[attribute]
        const field = attrOptions && attrOptions.field || attribute
        let aggregateColumn: any = Sequelize.col(field)

        if (options.distinct) {
            aggregateColumn = Sequelize.fn('DISTINCT', aggregateColumn)
        }

        let { group } = options
        if (Array.isArray(group) && Array.isArray(group[0])) {
            group = _.flatten(group)
        }
        options.attributes = _.unionBy(
            options.attributes,
            group,
            [[Sequelize.fn(aggregateFunction, aggregateColumn), aggregateFunction]],
            a => Array.isArray(a) ? a[1] : a,
        )

        if (!options.dataType) {
            if (attrOptions) {
                options.dataType = attrOptions.type
            } else {
                options.dataType = new DataTypes.FLOAT()
            }
        } else {
            options.dataType = this.model.sequelize.normalizeDataType(options.dataType)
        }

        Utils.mapOptionFieldNames(options, this.model)
        options = this.model._paranoidClause(this.model, options)

        const queryGenerator = QueryGeneratorHelper.getQueryGenerator(this.model)

        return {
            query: queryGenerator.selectQuery(tableName || this.model.getTableName(), options, this.model).slice(0, -1),
            options,
        }
    }


    private prepareAttributes(options: Record<string, any>, tableAlias?: string): Record<string, any> {
        if (tableAlias) {
            options.tableAs = tableAlias
        }

        if (_.isEmpty(options.include) && tableAlias) {
            options.attributes = options.attributes.map(p => {
                if (_.isString(p)) {
                    return tableAlias + '.' + p
                }
                return p
            })
        }
        return options
    }
}
