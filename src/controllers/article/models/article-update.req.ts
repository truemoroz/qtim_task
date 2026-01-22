import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class ArticleUpdateReq {
    @FieldDescriptor({
        example: 'Understanding TypeScript Decorators',
        description: 'Title of the article',
        required: false,
        minLength: 5,
        maxLength: 150,
    })
        title?: string

    @FieldDescriptor({
        example: 'This article explains the concept of decorators in TypeScript...',
        description: 'Content of the article',
        required: false,
        minLength: 20,
    })
        description?: string

    @FieldDescriptor({
        example: 42,
        description: 'ID of the author creating the article',
        required: false,
    })
        authorId?: number

    @FieldDescriptor({
        example: '2024-01-01T00:00:00Z',
        description: 'Publish date of the article',
        required: false,
    })
        publishDate?: Date
}
