import { ApiController } from '@/common/decorators/basic/ApiControllerDecorator'
import { DocApiTag } from '@/common/docs/DocApiTag'
import { UserService } from '@/services/user/user.service'
import { Body, Post } from '@nestjs/common'
import { ApiMethodDocs } from '@/common/decorators/basic/ApiMethodDocsDecorator'
import { EmptySuccessResponse } from '@/common/models/responses/EmptySuccessResponse'
import { UserCreateReq } from '@/controllers/user/models/req/user-create.req'
import { LoginRes } from '@/controllers/user/models/req/login.res'
import { JwtAuthService } from '@/services/jwt/jwt-auth.service'

@ApiController('user', DocApiTag.User)
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly jwtAuthService: JwtAuthService) {
    }

    @Post()
    @ApiMethodDocs('Create User', EmptySuccessResponse)
    async createUser(@Body() request: UserCreateReq): Promise<EmptySuccessResponse> {
        const { email, password } = request
        await this.userService.createUser(email, password)
        return new EmptySuccessResponse()
    }

    @Post('/auth')
    @ApiMethodDocs('Authenticate User', LoginRes)
    async authUser(@Body() request: UserCreateReq): Promise<LoginRes> {
        const { email, password } = request
        const user = await this.userService.validateUser(email, password)
        const token = await this.jwtAuthService.generateTokens(user)
        return new LoginRes(token)
    }

}
