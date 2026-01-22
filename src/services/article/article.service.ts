import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from '@/common/models/database/article.entity'
import { Repository } from 'typeorm'
import { ArticleDTO } from '@/services/article/models/article-dto'

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(Article) private articleRepository: Repository<Article>) {

    }

    async createArticle(article: ArticleDTO): Promise<Article> {
        const newArticle = this.articleRepository.create(article)
        return await this.articleRepository.save(newArticle)
    }

    async getAllArticles(): Promise<Article[]> {
        return await this.articleRepository.find()
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
