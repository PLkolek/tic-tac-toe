import { DbUser, Saved } from "../model";
import { Service } from "typedi";

@Service({ global: true })
export class UserRepository {
    private users: Saved<DbUser>[] = [];
    private nextId: number = 1;

    public create(user: DbUser): Saved<DbUser> {
        const savedUser = { ...user, id: String(this.nextId++) }
        this.users.push(savedUser);
        return savedUser;
    }

    public getAll(): Saved<DbUser>[] {
        return this.users;
    }

    public getByEmail(email: string): Saved<DbUser> | undefined {
        return this.users.find(u => u.email == email);
    }

    public getByIds(ids: string[]): Saved<DbUser>[] {
        return this.users.filter(u => ids.includes(u.id))
    }
}
