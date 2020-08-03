import { Service } from 'typedi'
import { Saved } from '../model/util'
import { DbUser } from '../model/user'
import { BaseRepository } from './baseRepository'
import { InMemoryDb, StoreName } from './inMemoryDb'
import { BadRequestError } from '../utils'

@Service()
export class UserRepository extends BaseRepository<StoreName.User> {
    constructor(db: InMemoryDb) {
        super(db, StoreName.User)
    }

    public async create(user: DbUser): Promise<Saved<DbUser>> {
        const existingUser = await this.getByEmail(user.email)
        if (existingUser) {
            throw new BadRequestError(`Email ${user.email} is already used`)
        }
        return super.create(user)
    }

    public async getByEmail(email: string): Promise<Saved<DbUser> | undefined> {
        return this.getBy((u) => u.email == email)
    }
}
