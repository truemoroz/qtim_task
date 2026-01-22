import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from '@/common/models/database/article.entity'
import { FindOptionsWhere, Raw, Repository } from 'typeorm'
import { ArticleDTO } from '@/services/article/models/article-dto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article) private articleRepository: Repository<Article>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async createArticle(article: ArticleDTO): Promise<Article> {
        const newArticle = this.articleRepository.create(article)
        return await this.articleRepository.save(newArticle)
    }

    async getAllArticles(page: number, limit: number, authorId?: number, publishDate?: Date): Promise<{ items: ArticleDTO[], total: number }> {
        const cacheKey = `articles_${page}_${limit}_${authorId ?? ''}_${publishDate ?? ''}`
        const cached = await this.cacheManager.get<{ items: ArticleDTO[], total: number }>(cacheKey)
        if (cached) {
            return cached
        }

        const where: FindOptionsWhere<Article> = {}
        if (authorId) {where.authorId = authorId}
        if (publishDate) {where.publishDate = publishDate}

        const [items, total] = await this.articleRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
        })

        await this.cacheManager.set(cacheKey, { items, total }, 600000) // Cache for 10 minutes
        return { items, total }
    }

    async updateArticle(id: string, article: ArticleDTO): Promise<Article> {
        await this.articleRepository.update(id, article)
        await this.invalidateArticlesCache()
        return await this.articleRepository.findOne({ where: { id } })
    }

    async removeArticle(id: string): Promise<null> {
        await this.articleRepository.delete(id)
        await this.invalidateArticlesCache()
        return null
    }

    private async invalidateArticlesCache(): Promise<void> {
        const keys = await this.cacheManager.store.keys('articles_*')
        if (keys && keys.length > 0) {
            await Promise.all(keys.map(key => this.cacheManager.del(key)))
        }
    }
}
