import { Test, TestingModule } from '@nestjs/testing'
import { ArticleService } from '@/services/article/article.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Article } from '@/common/models/database/article.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Repository } from 'typeorm'
import { Cache } from 'cache-manager'
import { ArticleDTO } from '@/services/article/models/article-dto'

describe('ArticleService', () => {
    let service: ArticleService

    const mockArticleRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findAndCount: jest.fn(),
        update: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
    }

    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
        store: {
            keys: jest.fn(),
        },
        del: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ArticleService,
                {
                    provide: getRepositoryToken(Article),
                    useValue: mockArticleRepository,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile()

        service = module.get<ArticleService>(ArticleService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('createArticle', () => {
        it('should create and save an article', async () => {
            const dto: ArticleDTO = {
                title: 'Test',
                description: 'Desc',
                authorId: 1,
                publishDate: new Date(),
            }
            const createdArticle = { ...dto, id: 'uuid' } as Article

            mockArticleRepository.create.mockReturnValue(createdArticle)
            mockArticleRepository.save.mockResolvedValue(createdArticle)
            mockCacheManager.store.keys.mockResolvedValue(['articles_key'])
            mockCacheManager.del.mockResolvedValue(undefined)

            const result = await service.createArticle(dto)

            expect(mockArticleRepository.create).toHaveBeenCalledWith(dto)
            expect(mockArticleRepository.save).toHaveBeenCalledWith(createdArticle)
            expect(result).toEqual(createdArticle)
        })
    })

    describe('getAllArticles', () => {
        it('should return cached articles if available', async () => {
            const cachedResult: { items: ArticleDTO[], total: number } = { items: [], total: 0 }
            mockCacheManager.get.mockResolvedValue(cachedResult)

            const result = await service.getAllArticles(1, 10)

            expect(mockCacheManager.get).toHaveBeenCalled()
            expect(mockArticleRepository.findAndCount).not.toHaveBeenCalled()
            expect(result).toEqual(cachedResult)
        })

        it('should fetch from repository and cache result if not in cache', async () => {
            mockCacheManager.get.mockResolvedValue(null)
            const articles = [{ id: '1', title: 'Test' }] as Article[]
            const total = 1
            mockArticleRepository.findAndCount.mockResolvedValue([articles, total])
            mockCacheManager.set.mockResolvedValue(undefined)

            const result = await service.getAllArticles(1, 10)

            expect(mockArticleRepository.findAndCount).toHaveBeenCalled()
            expect(mockCacheManager.set).toHaveBeenCalled()
            expect(result).toEqual({ items: articles, total })
        })

        it('should apply filters correctly', async () => {
            mockCacheManager.get.mockResolvedValue(null)
            mockArticleRepository.findAndCount.mockResolvedValue([[], 0])

            const authorId = 1
            const publishDate = new Date('2024-01-01')

            await service.getAllArticles(1, 10, authorId, publishDate)

            expect(mockArticleRepository.findAndCount).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        authorId,
                        publishDate: expect.anything(), // Partial match because of Raw
                    }),
                }),
            )
        })
    })

    describe('updateArticle', () => {
        it('should update article and invalidate cache', async () => {
            const id = 'uuid'
            const dto: ArticleDTO = { title: 'Updated' } as ArticleDTO
            const updatedArticle = { id, ...dto } as Article

            mockArticleRepository.update.mockResolvedValue({ affected: 1 })
            mockCacheManager.store.keys.mockResolvedValue(['articles_key'])
            mockArticleRepository.findOne.mockResolvedValue(updatedArticle)

            const result = await service.updateArticle(id, dto)

            expect(mockArticleRepository.update).toHaveBeenCalledWith(id, dto)
            expect(mockCacheManager.store.keys).toHaveBeenCalledWith('articles_*')
            expect(mockCacheManager.del).toHaveBeenCalledWith('articles_key')
            expect(mockArticleRepository.findOne).toHaveBeenCalledWith({ where: { id } })
            expect(result).toEqual(updatedArticle)
        })
    })

    describe('removeArticle', () => {
        it('should delete article and invalidate cache', async () => {
            const id = 'uuid'
            mockArticleRepository.delete.mockResolvedValue({ affected: 1 })
            mockCacheManager.store.keys.mockResolvedValue([])

            const result = await service.removeArticle(id)

            expect(mockArticleRepository.delete).toHaveBeenCalledWith(id)
            expect(mockCacheManager.store.keys).toHaveBeenCalledWith('articles_*')
            expect(result).toBeNull()
        })
    })
})
