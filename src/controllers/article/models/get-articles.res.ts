import { SuccessResponse } from '@/common/models/responses/SuccessResponse'
import { ArticleVM } from '@/controllers/article/models/create-article.res'
import { SuccessResponsePayloadDocs } from '@/common/decorators/basic/response/SuccessResponsePayloadDocDecorator'
import { ArticleDTO } from '@/services/article/models/article-dto'

@SuccessResponsePayloadDocs(ArticleVM, true)
export class GetArticlesRes extends SuccessResponse<ArticleDTO[]> {

}
