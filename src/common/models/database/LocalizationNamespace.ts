import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'
import { Column, DataType, HasMany, Table } from 'sequelize-typescript'
import { CustomDataTypes } from '@/common/lib/sequelize/dataTypes'
import { LTreeType } from '@/common/lib/sequelize/dataTypes/LTree'
import { LocalizationMessage } from '@/common/models/database/LocalizationMessage'

export type LocalisationNamespaceCA = {
    namespace: LTreeType
}

@Table({ tableName: 'kernel_localization_namespace' })
export class LocalizationNamespace extends QueryableModel<LocalizationNamespace, LocalisationNamespaceCA> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number

    @Column({ type: CustomDataTypes.LTree })
    namespace: LTreeType

    @HasMany(() => LocalizationMessage)
    messages: LocalizationMessage[]
}
