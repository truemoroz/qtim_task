import { Model } from 'sequelize-typescript'
import {
  FindAttributeOptions,
  FindOptions,
  GroupOption,
  Identifier,
  Includeable,
  IncludeOptions,
  OrderItem,
  Transaction,
  WhereOptions,
} from 'sequelize'
import { ModelNotFoundException } from '@/common/exceptions/apiExceptions'
import _ from 'lodash'
import { RawDBModelQuery } from '@/common/lib/queryBuilder/RawDBModelQuery'
import { QueryableModel, QueryableModelCtor } from '@/common/lib/queryBuilder/models/QueryableModel'
import { InternalServerErrorException } from '@nestjs/common'
import { Col, Fn, Literal } from 'sequelize/types/utils'


export type MAttributes<M extends Model> = M['_attributes']
export type MCreationAttributes<M extends Model> = M['_creationAttributes']
export type OrderItemColumn = string | Col | Fn | Literal
export type QueryData<M extends Model> =
    FindOptions<MAttributes<M>>
    & { include?: Includeable[] }
    & { order?: OrderItem[] }

export class DBModelQuery<M extends Model,
    T1 extends QueryableModel = never,
    T2 extends QueryableModel = never,
    T3 extends QueryableModel = never,
    T4 extends QueryableModel = never,
    T5 extends QueryableModel = never,
    T6 extends QueryableModel = never,
    T7 extends QueryableModel = never,
    T8 extends QueryableModel = never,
    T9 extends QueryableModel = never,
    T10 extends QueryableModel = never> {
    protected resultQueryData: QueryData<M>

    protected included: Includeable[] = []

    protected includeOptions: IncludeOptions = {}

    constructor(
        protected model: QueryableModelCtor<M>,
        protected readonly parent?: DBModelQuery<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>,
    ) {
        this.resultQueryData = {
            useMaster: true,
        }
    }

    //#region Build

    public where(options: WhereOptions<MAttributes<M>>): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        if (!this.resultQueryData.where) {
            this.resultQueryData.where = options
        } else {
            this.resultQueryData.where = { ...this.resultQueryData.where, ...options }
        }
        return this
    }

    public select(options: FindAttributeOptions): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        if (this.resultQueryData.attributes) {
            this.resultQueryData.attributes = { ...this.resultQueryData.attributes, ...options }
        } else {
            this.resultQueryData.attributes = options
        }
        return this
    }

    public limit(value: number): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        this.resultQueryData.limit = value
        return this
    }

    public offset(value: number): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        this.resultQueryData.offset = value
        return this
    }

    public orderBy(item: OrderItem | OrderItem[]): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>
    public orderBy(key: OrderItemColumn & keyof M, direction: 'ASC' | 'DESC'): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>
    public orderBy(item?: OrderItem | (OrderItemColumn) | OrderItem[], direction?: 'ASC' | 'DESC'): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        if (!this.resultQueryData.order) {
            this.resultQueryData.order = []
        }
        if (direction) {
            this.resultQueryData.order.push([item as OrderItemColumn, direction])
        } else {
            if (Array.isArray(item)) {
                this.resultQueryData.order.push(...<OrderItem[]>item)
            } else {
                this.resultQueryData.order.push(item)
            }
        }
        return this
    }

    public transaction(t: Transaction): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        this.resultQueryData.transaction = t
        return this
    }

    public include(data: Includeable | Includeable[], options?: IncludeOptions): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        if (Array.isArray(data)) {
            this.included.push(...data.map(p => Object.assign(p, options)))
        } else {
            this.included.push(Object.assign(data, options))
        }
        return this
    }

    public includeModel<T extends QueryableModel>(model: QueryableModelCtor<T>, options?: IncludeOptions): DBModelQuery<T, M, T1, T2, T3, T4, T5, T6, T7, T8, T9> {
        const modelQuery = model.query(this)
        modelQuery.includeOptions = options
        return modelQuery
    }

    public endInclude(): T1 extends undefined ? undefined : DBModelQuery<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        if (this.parent) {
            this.parent.includeQueryable(this)
            return this.parent as any
        }
        throw new InternalServerErrorException('Model parent not defined')
    }

    public conditionalEndInclude(condition: boolean): T1 extends undefined ? undefined : DBModelQuery<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        if (this.parent) {
            if (condition) {
                return this.endInclude()
            }
            return this.parent as any
        }
        throw new InternalServerErrorException('Model parent not defined')
    }

    public includeQueryable(data: DBModelQuery<any> | DBModelQuery<any>[], options?: IncludeOptions): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        if (Array.isArray(data)) {
            this.included.push(...data.map(p => Object.assign(p.getIncludeData(), options)))
        } else {
            this.included.push(Object.assign(data.getIncludeData(), options))
        }
        return this
    }

    public useSubQuery(value: boolean): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        this.resultQueryData.subQuery = value
        return this
    }

    public raw(value: boolean): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        this.resultQueryData.raw = value
        return this
    }

    public nest(value: boolean): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        this.resultQueryData.nest = value
        return this
    }

    public groupBy(options: GroupOption): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        this.resultQueryData.group = options
        return this
    }

    public useReplica(): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        this.resultQueryData.useMaster = false
        return this
    }

    public useMaster(): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        this.resultQueryData.useMaster = false
        return this
    }

    //#endregion

    //#region Raw SQL

    public asSql(): RawDBModelQuery<M> {
        return new RawDBModelQuery<M>(this, this.model)
    }

    //#endregion

    //#region Get data

    public async count(distinct = true): Promise<number> {
        return this.model.count({ ...this.getRawQueryOptions(), distinct })
    }

    public async getOne(): Promise<M> {
        return this.model.findOne(this.getRawQueryOptions())
    }

    public async getAll(): Promise<M[]> {
        return this.model.findAll(this.getRawQueryOptions())
    }

    public async getByPK(identifier: Identifier): Promise<M> {
        this.resultQueryData.where = {
            [this.model.primaryKeyAttribute]: identifier,
        } as any
        return this.model.findByPk(identifier, this.getRawQueryOptions())
    }

    public async tryGetOne(): Promise<M> {
        const res = await this.getOne()
        if (!res) {
            throw new ModelNotFoundException(this.model)
        }
        return res
    }

    public async tryFindByPk(identifier: Identifier): Promise<M> {
        const res = await this.getByPK(identifier)
        if (!res) {
            throw new ModelNotFoundException(this.model)
        }
        return res
    }

    //#endregion

    public getRawQueryOptions(): FindOptions<MAttributes<M>> {
        if (!this.resultQueryData.include) {
            this.resultQueryData.include = []
        }
        const res = _.cloneDeep(this.resultQueryData)
        if (this.included.length > 0) {
            res.include = this.included
        }
        return res
    }

    private getIncludeData(): Includeable {
        return {
            model: this.model,
            ...this.resultQueryData,
            ...this.includeOptions,
            include: this.included,
        }
    }
}
