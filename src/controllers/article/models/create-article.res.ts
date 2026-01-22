import { SuccessResponse } from '@/common/models/responses/SuccessResponse'
import { ArticleDTO } from '@/services/article/models/article-dto'
import { SuccessResponsePayloadDocs } from '@/common/decorators/basic/response/SuccessResponsePayloadDocDecorator'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class ArticleVM {
    @FieldDescriptor({ example: 'fd52e552-b36a-46e5-a9ab-099d84a0a6f8' })
        id: string

    @FieldDescriptor({ example: 'Sample Article' })
        title: string

    @FieldDescriptor({ example: 'This is a sample article for testing purposes.' })
        description: string

    @FieldDescriptor({ example: '1' })
        authorId: string

    @FieldDescriptor({ example: '2024-06-01 17:00:00.000000' })
        publishDate: Date
}

@SuccessResponsePayloadDocs(ArticleVM)
export class CreateArticleRes extends SuccessResponse<ArticleDTO> {
    constructor(article: ArticleDTO) {
        super()
        this.payload = article
    }
}
