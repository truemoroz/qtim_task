import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Author } from './author.entity'

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn('uuid')
        id: string

    @Column({ type: 'varchar', length: 255 })
        title: string

    @Column({ type: 'text' })
        description: string

    @Column({ name: 'publish_date', type: 'date' })
        publishDate: Date

    @Column({ name: 'author_id', type: 'int' })
        authorId: number

    @ManyToOne(() => Author)
    @JoinColumn({ name: 'author_id' })
        author: Author

}
