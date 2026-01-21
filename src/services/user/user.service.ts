import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@/common/models/database/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {

    }

    async createUser(email: string, password: string): Promise<User> {
        const passwordHash = this.hashPassword(password)
        const newUser = this.userRepository.create({ email, passwordHash })
        return await this.userRepository.save(newUser)
    }

    private hashPassword(password: string): string {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } })
        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            return user
        }
        return null
    }
    
}
