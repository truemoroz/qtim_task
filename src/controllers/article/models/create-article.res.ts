import { SuccessResponse } from '@/common/models/responses/SuccessResponse'
import { ArticleDTO } from '@/services/article/models/article-dto'
import { SuccessResponsePayloadDocs } from '@/common/decorators/basic/response/SuccessResponsePayloadDocDecorator'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'
import { ViewModel } from '@/services/view-model/decorators/ViewModel'
import { Article } from '@/common/models/database/article.entity'
import { VMProperty } from '@/services/view-model/decorators/VMProperty'

@ViewModel(Article)
export class ArticleVM {
    @VMProperty('id')
    @FieldDescriptor({ example: 'fd52e552-b36a-46e5-a9ab-099d84a0a6f8' })
        id: string

    @VMProperty('title')
    @FieldDescriptor({ example: 'Sample Article' })
        title: string

    @VMProperty('description')
    @FieldDescriptor({ example: 'This is a sample article for testing purposes.' })
        description: string

    @VMProperty('authorId')
    @FieldDescriptor({ example: '1' })
        authorId: string

    @VMProperty('publishDate')
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
