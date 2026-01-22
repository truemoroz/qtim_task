import { Test, TestingModule } from '@nestjs/testing'
import { ArticleController } from '@/controllers/article/article.controller'
import { ArticleService } from '@/services/article/article.service'
import { ViewModelService } from '@/services/view-model/view-model.service'
import { ArticleCreateReq } from '@/controllers/article/models/article-create.req'
import { ArticlePaginationReq } from '@/controllers/article/models/article-pagination.req'
import { ArticleUpdateReq } from '@/controllers/article/models/article-update.req'
import { ArticleVM, CreateArticleRes } from '@/controllers/article/models/create-article.res'
import { GetArticlesRes } from '@/controllers/article/models/get-articles.res'
import { EmptySuccessResponse } from '@/common/models/responses/EmptySuccessResponse'
import { ArticleDTO } from '@/services/article/models/article-dto'
import { AuthGuard } from '@/common/guards/auth.guard'

describe('ArticleController', () => {
    let controller: ArticleController

    const mockArticleService = {
        getAllArticles: jest.fn(),
        createArticle: jest.fn(),
        updateArticle: jest.fn(),
        removeArticle: jest.fn(),
    }

    const mockViewModelService = {
        mapArray: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ArticleController],
            providers: [
                {
                    provide: ArticleService,
                    useValue: mockArticleService,
                },
                {
                    provide: ViewModelService,
                    useValue: mockViewModelService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .compile()

        controller = module.get<ArticleController>(ArticleController)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('getArticles', () => {
        it('should return articles list', async () => {
            const query: ArticlePaginationReq = { page: 1, limit: 10 }
            const serviceResponse = { items: [{ id: '1' } as ArticleDTO], total: 1 }
            const vmItems = [{ id: '1' } as ArticleVM]

            mockArticleService.getAllArticles.mockResolvedValue(serviceResponse)
            mockViewModelService.mapArray.mockResolvedValue(vmItems)

            const result = await controller.getArticles(query)

            expect(mockArticleService.getAllArticles).toHaveBeenCalledWith(query.page, query.limit, query.authorId, query.publishDate)
            expect(mockViewModelService.mapArray).toHaveBeenCalledWith({
                source: serviceResponse.items,
                destinationType: ArticleVM,
            })
            expect(result).toBeInstanceOf(GetArticlesRes)
            expect(result.payload.list).toEqual(vmItems)
            expect(result.payload.total).toEqual(serviceResponse.total)
        })
    })

    describe('createArticle', () => {
        it('should create and return new article', async () => {
            const req: ArticleCreateReq = { title: 'New', description: 'Desc', authorId: 1, publishDate: new Date() }
            const createdArticle = { id: '1', ...req } as ArticleDTO

            mockArticleService.createArticle.mockResolvedValue(createdArticle)

            const result = await controller.createArticle(req)

            expect(mockArticleService.createArticle).toHaveBeenCalledWith(req)
            expect(result).toBeInstanceOf(CreateArticleRes)
            expect(result.payload).toEqual(createdArticle)
        })
    })

    describe('updateArticle', () => {
        it('should update and return article', async () => {
            const uuid = '1'
            const req: ArticleUpdateReq = { title: 'Updated' }
            const updatedArticle = { id: uuid, ...req } as ArticleDTO

            mockArticleService.updateArticle.mockResolvedValue(updatedArticle)

            const result = await controller.updateArticle(uuid, req)

            expect(mockArticleService.updateArticle).toHaveBeenCalledWith(uuid, req)
            expect(result).toBeInstanceOf(CreateArticleRes)
            expect(result.payload).toEqual(updatedArticle)
        })
    })

    describe('deleteArticle', () => {
        it('should delete article and return empty success response', async () => {
            const uuid = '1'
            mockArticleService.removeArticle.mockResolvedValue(null)

            const result = await controller.deleteArticle(uuid)

            expect(mockArticleService.removeArticle).toHaveBeenCalledWith(uuid)
            expect(result).toBeInstanceOf(EmptySuccessResponse)
        })
    })
})
