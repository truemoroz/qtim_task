import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/common/models/database/user.entity'
import { UserService } from '@/services/user/user.service'
import { UserController } from '@/controllers/user/user.controller'
import { JwtAuthServiceModule } from '@/services/jwt/jwt-auth.service.module'

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtAuthServiceModule ],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
