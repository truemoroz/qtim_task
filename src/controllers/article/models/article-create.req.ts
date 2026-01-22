import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class ArticleCreateReq {
    @FieldDescriptor({
        example: 'Understanding TypeScript Decorators',
        description: 'Title of the article',
        required: true,
        minLength: 5,
        maxLength: 150,
    })
        title: string

    @FieldDescriptor({
        example: 'This article explains the concept of decorators in TypeScript...',
        description: 'Content of the article',
        required: true,
        minLength: 20,
    })
        description: string

    @FieldDescriptor({
        example: 42,
        description: 'ID of the author creating the article',
        required: true,
    })
        authorId: number

    @FieldDescriptor({
        example: '2024-06-15T12:00:00Z',
        description: 'Publication date of the article',
        required: true,
    })
        publishDate: Date
}
