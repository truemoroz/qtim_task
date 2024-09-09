import { Model, Repository } from 'sequelize-typescript'
import { DBModelQuery } from '@/common/lib/queryBuilder/DBModelQuery'
import { NonAbstract } from 'sequelize-typescript/dist/shared/types'
import { RecursiveDBModelQuery } from '@/common/lib/queryBuilder/RecursiveDBModelQuery'

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class QueryableModel<TModelAttributes extends {} = any, TCreationAttributes extends {} = TModelAttributes> extends Model<TModelAttributes, TCreationAttributes> {

    public static query<M extends Model,
        T1 extends QueryableModel = never,
        T2 extends QueryableModel = never,
        T3 extends QueryableModel = never,
        T4 extends QueryableModel = never,
        T5 extends QueryableModel = never,
        T6 extends QueryableModel = never,
        T7 extends QueryableModel = never,
        T8 extends QueryableModel = never,
        T9 extends QueryableModel = never,
        T10 extends QueryableModel = never>
    (this: QueryableModelCtor<M>, parent?: DBModelQuery<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>): DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        return new DBModelQuery<M, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(this, parent)
    }

    public static recursiveQuery<M extends Model>(this: QueryableModelCtor<M>): RecursiveDBModelQuery<M> {
        return new RecursiveDBModelQuery<M>(this)
    }
}

export type QueryableModelCtor<M extends QueryableModel = QueryableModel> =
    Repository<M>
    & NonAbstract<typeof QueryableModel>;
