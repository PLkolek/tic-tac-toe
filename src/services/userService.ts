import { Service } from 'typedi'
import { omitPasswordHash, omitPasswordHashFromUsers, UnsavedUser, UserData } from '../model/user'
import { Saved } from '../model/util'
import { UserRepository } from '../repositories/userRepository'
import * as bcrypt from 'bcryptjs'

@Service()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    public async getByIds(userIds: string[]): Promise<Saved<UserData>[]> {
        const dbUsers = await this.userRepository.getByIds(userIds)
        return omitPasswordHashFromUsers(dbUsers)
    }

    public async create(user: UnsavedUser): Promise<Saved<UserData>> {
        const passwordHash = await bcrypt.hash(user.password, 10)
        const savedUser = await this.userRepository.create({ email: user.email, passwordHash })
        return omitPasswordHash(savedUser)
    }

    public async getByEmailAndPassword(
        email: string,
        password: string,
    ): Promise<Saved<UserData> | null> {
        const user = await this.userRepository.getByEmail(email)
        if (!user) {
            return null
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
            return null
        }
        return omitPasswordHash(user)
    }
}
