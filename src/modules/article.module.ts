import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from '@/common/models/database/article.entity'
import { ArticleService } from '@/services/article/article.service'
import { ArticleController } from '@/controllers/article/article.controller'
import { JwtAuthServiceModule } from '@/services/jwt/jwt-auth.service.module'

@Module({
    imports: [TypeOrmModule.forFeature([Article]), JwtAuthServiceModule ],
    providers: [ArticleService],
    controllers: [ArticleController],
})

export class ArticleModule{}
