import { Service } from 'typedi'
import { Saved } from '../model/util'
import { DbUser } from '../model/user'

@Service({ global: true })
export class UserRepository {
    private users: Saved<DbUser>[] = []
    private nextId: number = 1

    public async create(user: DbUser): Promise<Saved<DbUser>> {
        //TODO: email unique
        const savedUser = { ...user, id: String(this.nextId++) }
        this.users.push(savedUser)
        return savedUser
    }

    public async getAll(): Promise<Saved<DbUser>[]> {
        return this.users
    }

    public async getByEmail(email: string): Promise<Saved<DbUser> | undefined> {
        return this.users.find((u) => u.email == email)
    }

    public async getByIds(ids: string[]): Promise<Saved<DbUser>[]> {
        return this.users.filter((u) => ids.includes(u.id))
    }
}
