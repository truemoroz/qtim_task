import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from '@/controllers/user/user.controller'
import { UserService } from '@/services/user/user.service'
import { JwtAuthService } from '@/services/jwt/jwt-auth.service'
import { UserCreateReq } from '@/controllers/user/models/req/user-create.req'
import { EmptySuccessResponse } from '@/common/models/responses/EmptySuccessResponse'
import { LoginRes } from '@/controllers/user/models/req/login.res'
import { User } from '@/common/models/database/user.entity'

describe('UserController', () => {
    let controller: UserController
    let userService: UserService
    let jwtAuthService: JwtAuthService

    const mockUserService = {
        createUser: jest.fn(),
        validateUser: jest.fn(),
    }

    const mockJwtAuthService = {
        generateTokens: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: JwtAuthService,
                    useValue: mockJwtAuthService,
                },
            ],
        }).compile()

        controller = module.get<UserController>(UserController)
        userService = module.get<UserService>(UserService)
        jwtAuthService = module.get<JwtAuthService>(JwtAuthService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('createUser', () => {
        it('should create user and return empty success response', async () => {
            const req: UserCreateReq = { email: 'test@test.com', password: 'pass' }
            mockUserService.createUser.mockResolvedValue({} as User)

            const result = await controller.createUser(req)

            expect(mockUserService.createUser).toHaveBeenCalledWith(req.email, req.password)
            expect(result).toBeInstanceOf(EmptySuccessResponse)
        })
    })

    describe('authUser', () => {
        it('should validate user and return token', async () => {
            const req: UserCreateReq = { email: 'test@test.com', password: 'pass' }
            const user = { id: '1', email: 'test@test.com' } as User
            const tokens = { access: 'access_token', refresh: 'refresh_token' }

            mockUserService.validateUser.mockResolvedValue(user)
            mockJwtAuthService.generateTokens.mockResolvedValue(tokens)

            const result = await controller.authUser(req)

            expect(mockUserService.validateUser).toHaveBeenCalledWith(req.email, req.password)
            expect(mockJwtAuthService.generateTokens).toHaveBeenCalledWith(user)
            expect(result).toBeInstanceOf(LoginRes)
            expect(result.payload.accessToken).toEqual(tokens.access)
            expect(result.payload.refreshToken).toEqual(tokens.refresh)
        })
    })
})
