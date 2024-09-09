// import { AbstractDataType, AbstractDataTypeConstructor } from 'sequelize/types/lib/data-types'
import { AbstractDataType, AbstractDataTypeConstructor } from 'sequelize/types/data-types'
import { Sequelize } from 'sequelize-typescript'
// import { Literal } from 'sequelize/types/lib/utils'
import { Op, WhereOptions } from 'sequelize'
import { Literal } from 'sequelize/types/utils'

// @ts-ignore
export class LTreeType implements AbstractDataType, AbstractDataTypeConstructor {
    key = 'LTREE'
    dialectTypes = 'postgres'

    warn(link: string, text: string): void {
        console.log(text)
    }

    stringify(value: unknown): string {
        return value.toString()
    }

    toSql(): string {
        return 'ltree'
    }

    static lQuery(attr: string, query: string): Literal {
        return Sequelize.literal(`${Sequelize.col(attr).col} ~ '${query}'`)
    }

    static upLine(attr: string, search: LTreeType): Literal {
        return Sequelize.literal(`${Sequelize.col(attr).col} @> '${search}'`)
    }

    static frontline(attr: string, search: LTreeType): WhereOptions {
        return this.downLine(attr, search, 0, 1)
    }

    static downLine(attr: string, search: LTreeType, minDepth?: number, maxDepth?: number): WhereOptions {
        let query = search.toString()
        if (minDepth !== undefined || maxDepth != undefined) {
            if (minDepth != maxDepth) {
                query += `.*{${minDepth || ''},${maxDepth || ''}}`
            } else {
                query += `.*{${minDepth}}`
            }
        } else {
            query += '.*'
        }
        return {
            [Op.and]: [
                Sequelize.literal(`${Sequelize.col(attr).col} <@ '${search}'`),
                LTreeType.lQuery(attr, query),
            ],
        }
    }

    static fromString(value: string): LTreeType {
        return value as unknown as LTreeType
    }
}
