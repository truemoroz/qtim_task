import { ISequelizeQueryGenerator } from '@/common/lib/sequelize/queryGenerator/interfaces/ISequelizeQueryGenerator'
import { ModelCtor } from 'sequelize-typescript'

export class QueryGeneratorHelper {
    public static getQueryGenerator(model: ModelCtor): ISequelizeQueryGenerator {
        return model.sequelize.getQueryInterface().queryGenerator as any
    }
}
