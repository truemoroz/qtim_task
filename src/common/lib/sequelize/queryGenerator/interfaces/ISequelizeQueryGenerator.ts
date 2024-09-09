import { ModelCtor } from 'sequelize-typescript'

type TableName = string | {
    tableName: string;
    schema: string;
    delimiter: string;
}

type ParameterOptions = {
    replacements?: { [key: string]: unknown },
    prefix: string,
}

export interface ISequelizeQueryGenerator {
    selectQuery(tableName: TableName, options: Record<string, any>, model: ModelCtor): string

    whereQuery(where: object, options?: ParameterOptions): string
}
