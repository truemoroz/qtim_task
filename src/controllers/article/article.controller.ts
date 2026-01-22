import { ApiController } from '@/common/decorators/basic/ApiControllerDecorator'
import { DocApiTag } from '@/common/docs/DocApiTag'
import { ArticleService } from '@/services/article/article.service'
import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { AuthRequired } from '@/common/decorators/auth/AuthRequired'
import { ArticleCreateReq } from '@/controllers/article/models/article-create.req'
import { ArticlePaginationReq } from '@/controllers/article/models/article-pagination.req'
import { ArticleDTO } from '@/services/article/models/article-dto'
import { ApiMethodDocs } from '@/common/decorators/basic/ApiMethodDocsDecorator'
import { ArticleVM, CreateArticleRes } from '@/controllers/article/models/create-article.res'
import { GetArticlesRes } from '@/controllers/article/models/get-articles.res'
import { ArticleUpdateReq } from '@/controllers/article/models/article-update.req'
import { EmptySuccessResponse } from '@/common/models/responses/EmptySuccessResponse'
import { ViewModelService } from '@/services/view-model/view-model.service'


@ApiController('article', DocApiTag.Article)
export class ArticleController {
    constructor(private readonly articleService: ArticleService,
                private readonly viewModelService: ViewModelService) {
    }

    @Get()
    @ApiMethodDocs('Get All Articles', GetArticlesRes)
    async getArticles(@Query() query: ArticlePaginationReq): Promise<GetArticlesRes> {
        const { items, total } = await this.articleService.getAllArticles(query.page, query.limit, query.authorId, query.publishDate)
        const vmItems = await this.viewModelService.mapArray({
            source: items,
            destinationType: ArticleVM })
        return new GetArticlesRes(vmItems, total)
    }

    @Post()
    @AuthRequired()
    @ApiMethodDocs('Create Article', CreateArticleRes)
    async createArticle(@Body() request: ArticleCreateReq): Promise<CreateArticleRes>{
        const newArticle: ArticleDTO = await this.articleService.createArticle(request)
        return new CreateArticleRes(newArticle)
    }

    @Put('/:uuid')
    @AuthRequired()
    @ApiMethodDocs('Update Article', CreateArticleRes)
    async updateArticle(
        @Param('uuid') uuid: string,
        @Body() request: ArticleUpdateReq): Promise<CreateArticleRes>{
        const updatedArticle: ArticleDTO = await this.articleService.updateArticle(uuid, request)
        return new CreateArticleRes(updatedArticle)
    }

    @Delete('/:uuid')
    @AuthRequired()
    @ApiMethodDocs('Delete Article', EmptySuccessResponse)
    async deleteArticle(
        @Param('uuid') uuid: string): Promise<EmptySuccessResponse> {
        await this.articleService.removeArticle(uuid)
        return new EmptySuccessResponse()
    }

}
