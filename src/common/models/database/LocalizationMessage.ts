import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript'
import { LocalizationNamespace } from '@/common/models/database/LocalizationNamespace'
import { Language } from '@/common/models/database/Language'

export type LocalizationMessageCA = {
    namespace_id: number
    language: string
    message: string
}

@Table({ tableName: 'kernel_localization_message' })
export class LocalizationMessage extends QueryableModel<LocalizationMessage, LocalizationMessageCA> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: string

    @ForeignKey(() => LocalizationNamespace)
    @Column(DataType.INTEGER)
    namespace_id: number

    @ForeignKey(() => Language)
    @Column(DataType.STRING)
    language: string

    @Column(DataType.TEXT)
    message: string

    @BelongsTo(() => LocalizationNamespace)
    namespace: LocalizationNamespace

    @BelongsTo(() => Language)
    languageModel: Language
}
