import { Saved } from '../model/util'
import { InMemoryDb, StoreName, StoreTypes } from './inMemoryDb'

export class BaseRepository<SN extends StoreName, Obj extends StoreTypes[SN] = StoreTypes[SN]> {
    constructor(private db: InMemoryDb, private storeName: SN) {}

    public async create(obj: Obj): Promise<Saved<Obj>> {
        return this.db.create(this.storeName, obj)
    }

    public async getAll(): Promise<Saved<Obj>[]> {
        return this.db.getAll(this.storeName) as Saved<Obj>[]
    }

    public async update(obj: Saved<Obj>): Promise<Saved<Obj>> {
        return this.db.update(this.storeName, obj)
    }

    public async get(id: string): Promise<Saved<Obj> | undefined> {
        return this.db.get(this.storeName, id) as Saved<Obj>
    }

    public async getBy(predicate: (obj: Saved<Obj>) => boolean): Promise<Saved<Obj> | undefined> {
        return this.db.getBy(this.storeName, predicate) as Saved<Obj>
    }

    public async getByIds(ids: string[]): Promise<Saved<Obj>[]> {
        return this.db.getByIds(this.storeName, ids) as Saved<Obj>[]
    }
}
