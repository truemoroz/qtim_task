import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '@/services/user/user.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '@/common/models/database/user.entity'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt')

describe('UserService', () => {
    let service: UserService

    const mockUserRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile()

        service = module.get<UserService>(UserService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('createUser', () => {
        it('should hash password and create user', async () => {
            const email = 'test@example.com'
            const password = 'password'
            const hashedPassword = 'hashed_password'
            const user = { id: 'uuid', email, passwordHash: hashedPassword } as User

            ;(bcrypt.genSaltSync as jest.Mock).mockReturnValue('salt')
            ;(bcrypt.hashSync as jest.Mock).mockReturnValue(hashedPassword)
            mockUserRepository.create.mockReturnValue(user)
            mockUserRepository.save.mockResolvedValue(user)

            const result = await service.createUser(email, password)

            expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 'salt')
            expect(mockUserRepository.create).toHaveBeenCalledWith({ email, passwordHash: hashedPassword })
            expect(mockUserRepository.save).toHaveBeenCalledWith(user)
            expect(result).toEqual(user)
        })
    })

    describe('validateUser', () => {
        it('should return user if credentials are valid', async () => {
            const email = 'test@example.com'
            const password = 'password'
            const hashedPassword = 'hashed_password'
            const user = { id: 'uuid', email, passwordHash: hashedPassword } as User

            mockUserRepository.findOne.mockResolvedValue(user)
            ;(bcrypt.compareSync as jest.Mock).mockReturnValue(true)

            const result = await service.validateUser(email, password)

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email } })
            expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword)
            expect(result).toEqual(user)
        })

        it('should return null if user not found', async () => {
            const email = 'test@example.com'
            const password = 'password'

            mockUserRepository.findOne.mockResolvedValue(null)

            const result = await service.validateUser(email, password)

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email } })
            expect(result).toBeNull()
        })

        it('should return null if password invalid', async () => {
            const email = 'test@example.com'
            const password = 'password'
            const hashedPassword = 'hashed_password'
            const user = { id: 'uuid', email, passwordHash: hashedPassword } as User

            mockUserRepository.findOne.mockResolvedValue(user)
            ;(bcrypt.compareSync as jest.Mock).mockReturnValue(false)

            const result = await service.validateUser(email, password)

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email } })
            expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword)
            expect(result).toBeNull()
        })
    })
})
