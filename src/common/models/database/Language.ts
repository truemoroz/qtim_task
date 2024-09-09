import { Column, DataType, Table } from 'sequelize-typescript'
import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'

export type LanguageCA = {
    id: string
    name: string
    is_active?: number
}

@Table({ tableName: 'language' })
export class Language extends QueryableModel<Language, LanguageCA> {
    @Column({ type: DataType.STRING(16), primaryKey: true })
    id: string

    @Column(DataType.STRING)
    name: string

    @Column(DataType.SMALLINT)
    is_active: number
}
