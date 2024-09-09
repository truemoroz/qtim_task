import { Column, DataType, Table } from 'sequelize-typescript'
import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'

@Table({ tableName: 'kernel_admin' })
export class Admin extends QueryableModel<Admin> {
    @Column({ type: DataType.INTEGER, primaryKey: true })
    id: number

    @Column(DataType.STRING)
    email: string

    @Column(DataType.STRING(127))
    password_hash: string

    @Column(DataType.STRING)
    firstname: string

    @Column(DataType.STRING)
    lastname: string

    @Column(DataType.DATE)
    registered_at: Date

    @Column(DataType.STRING(127))
    resetpwdhash: string

    @Column(DataType.STRING(16))
    language_id: string

    @Column(DataType.DATE)
    password_change_at: Date
}
