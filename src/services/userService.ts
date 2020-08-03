import { Service } from 'typedi'
import { omitPasswordHashFromUsers, UserData } from '../model/user'
import { Saved } from '../model/util'
import { UserRepository } from '../repositories/userRepository'

@Service()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    public async getByIds(userIds: string[]): Promise<Saved<UserData>[]> {
        const dbUsers = await this.userRepository.getByIds(userIds)
        return omitPasswordHashFromUsers(dbUsers)
    }
}
