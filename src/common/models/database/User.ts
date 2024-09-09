import { BeforeCreate, BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript'
import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'
import { DateHelper } from '@/common/lib/date/DateHelper'

export type UserCA = {
    id?: number
    account_id: number
    login: string
    email: string
    password_hash: string
    firstname: string
    lastname: string
    registered_at?: Date
    resetpwdhash?: string
}

@Table({ tableName: 'kernel_user' })
export class User extends QueryableModel<User, UserCA> {

    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number

    @Column(DataType.STRING)
    login: string

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

    @BeforeCreate({})
    public static beforeCreateHandler(model: User): void {
        if (!model.registered_at) {
            model.registered_at = DateHelper.getUtcNow().toJSDate()
        }
    }

}
