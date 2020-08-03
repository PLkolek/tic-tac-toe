import { DbUser } from '../model/user'
import { Saved } from '../model/util'
import { Game } from '../model/game'
import { Service } from 'typedi'

export enum StoreName {
    User = 'User',
    Game = 'Game',
}

type Store<T> = {
    contents: Saved<T>[]
    nextId: number
}

const emptyStore: Store<any> = {
    contents: [],
    nextId: 1,
}

export type StoreTypes = {
    [StoreName.User]: DbUser
    [StoreName.Game]: Game
}

type Db = {
    [K in keyof StoreTypes]: Store<StoreTypes[K]>
}

@Service({ global: true })
export class InMemoryDb {
    private stores: Db = {
        [StoreName.User]: emptyStore,
        [StoreName.Game]: emptyStore,
    }

    public create<SN extends keyof StoreTypes, Obj extends StoreTypes[SN]>(
        storeName: SN,
        obj: Obj,
    ): Saved<Obj> {
        const store = this.stores[storeName]
        const savedObj = { ...obj, id: String(store.nextId++) }
        store.contents.push(obj as any)
        return savedObj
    }

    public getAll<SN extends StoreName>(storeName: SN): Saved<StoreTypes[SN]>[] {
        return this.stores[storeName].contents as any
    }

    public update<SN extends keyof StoreTypes, Obj extends StoreTypes[SN]>(
        storeName: SN,
        obj: Saved<Obj>,
    ): Saved<Obj> {
        const store = this.stores[storeName]
        const objIndex = store.contents.findIndex(this.byId(obj.id))
        if (objIndex != -1) {
            store.contents[objIndex] = obj as any
        } else {
            //TODO: fail here
            store.contents.push(obj as any)
        }
        return obj
    }

    public get<SN extends StoreName>(storeName: SN, id: string): Saved<StoreTypes[SN]> | undefined {
        return this.getBy(storeName, this.byId(id))
    }

    public getBy<SN extends keyof StoreTypes, Obj extends StoreTypes[SN]>(
        storeName: SN,
        predicate: (obj: Saved<Obj>) => boolean,
    ): Saved<Obj> | undefined {
        return (this.stores[storeName].contents as any[]).find(predicate)
    }

    public getByIds<SN extends StoreName>(storeName: SN, ids: string[]): Saved<StoreTypes[SN]>[] {
        return (this.stores[storeName].contents as any[]).filter((u) => ids.includes(u.id))
    }

    private byId(id: string) {
        return (g: Saved<{}>) => g.id == id
    }
}
