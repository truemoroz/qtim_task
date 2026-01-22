import { ArticleVM } from '@/controllers/article/models/create-article.res'
import { PaginationPayload, PaginationResponse } from '@/common/models/responses/PaginationResponse'
import { PaginationResponseDocs } from '@/common/decorators/basic/response/PaginationResponseDocsDecorator'

class ArticlePaginationPayload extends PaginationPayload<ArticleVM>{
}

@PaginationResponseDocs(ArticlePaginationPayload, ArticleVM)
export class GetArticlesRes extends PaginationResponse<ArticleVM> {
    constructor(items: ArticleVM[], total: number) {
        super(new ArticlePaginationPayload(items, total))
    }
}
