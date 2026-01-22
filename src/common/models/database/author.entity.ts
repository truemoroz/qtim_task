import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('authors')
export class Author {
    @PrimaryGeneratedColumn('increment')
        id: number

    @Column({ type: 'varchar', length: 255 })
        firstname: string

    @Column({ type: 'varchar', length: 255 })
        secondName: string
}
