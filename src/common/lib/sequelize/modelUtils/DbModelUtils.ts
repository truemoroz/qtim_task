import { QueryableModelCtor } from '@/common/lib/queryBuilder/models/QueryableModel'
import { TModelId } from '@/common/lib/sequelize/modelUtils/types/TModelId'

export class DbModelUtils {
    public static async getNextModelIds(model: QueryableModelCtor, count: number, sequenceName?: string): Promise<TModelId[]> {
        sequenceName = sequenceName ?? model.tableName + '_id_seq'
        const [series] = await model.sequelize.query(`select nextval('${sequenceName}') as "id"
                                                      from generate_series(1, ${count});`)
        return series as TModelId[]
    }
}
