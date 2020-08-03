import { Service } from 'typedi'
import { Saved } from '../model/util'
import { DbUser } from '../model/user'
import { BaseRepository } from './baseRepository'
import { InMemoryDb, StoreName } from './inMemoryDb'

@Service()
export class UserRepository extends BaseRepository<StoreName.User> {
    constructor(db: InMemoryDb) {
        super(db, StoreName.User)
        //TODO: email unique
    }

    public async getByEmail(email: string): Promise<Saved<DbUser> | undefined> {
        return this.getBy((u) => u.email == email)
    }
}
