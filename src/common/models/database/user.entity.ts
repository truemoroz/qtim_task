import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
      id: string

  @Column({ type: 'varchar', length: 255, unique: true })
      email: string

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
      passwordHash: string

  @Column({ name: 'is_active', type: 'boolean', default: true })
      isActive: boolean

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
      createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
      updatedAt: Date
}
