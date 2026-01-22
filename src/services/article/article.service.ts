import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from '@/common/models/database/article.entity'
import { FindOptionsWhere, Repository } from 'typeorm'
import { ArticleDTO } from '@/services/article/models/article-dto'

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(Article) private articleRepository: Repository<Article>) {

    }

    async createArticle(article: ArticleDTO): Promise<Article> {
        const newArticle = this.articleRepository.create(article)
        return await this.articleRepository.save(newArticle)
    }

    async getAllArticles(page: number, limit: number, authorId?: number, publishDate?: Date): Promise<{ items: ArticleDTO[], total: number }> {
        const where: FindOptionsWhere<Article> = {}
        if (authorId) {where.authorId = authorId}
        if (publishDate) {where.publishDate = publishDate}

        const [items, total] = await this.articleRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
        })
        return { items, total }
    }

    async updateArticle(id: string, article: ArticleDTO): Promise<Article> {
        await this.articleRepository.update(id, article)
        return await this.articleRepository.findOne({ where: { id } })
    }

    async removeArticle(id: string): Promise<null> {
        await this.articleRepository.delete(id)
        return null
    }


}
