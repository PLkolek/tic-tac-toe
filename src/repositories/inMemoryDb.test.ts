import { InMemoryDb, StoreName } from './inMemoryDb'
import { omit } from '../utils'
import { DbUser } from '../model/user'

const item = { passwordHash: 'some hash', email: 'email@test.com' }
const otherItem = { passwordHash: 'other hash', email: 'other-email@test.com' }

test('create generates id and other than that does not modify stored item', () => {
    const db = new InMemoryDb()
    const storedItem = db.create(StoreName.User, item)
    expect(storedItem.id).toBeDefined()
    expect(omit(storedItem, 'id')).toEqual(item)
})

test('created items are returned by getAll', () => {
    const db = new InMemoryDb()
    const storedItem = db.create(StoreName.User, item)
    const storedOtherItem = db.create(StoreName.User, otherItem)
    expect(db.getAll(StoreName.User)).toEqual([storedItem, storedOtherItem])
})

test('created item is returned by get', () => {
    const db = new InMemoryDb()
    const storedItem = db.create(StoreName.User, item)
    db.create(StoreName.User, otherItem)
    expect(db.get(StoreName.User, storedItem.id)).toEqual(storedItem)
})

test('created item is returned by getByIds', () => {
    const db = new InMemoryDb()
    const storedItem = db.create(StoreName.User, item)
    const storedOtherItem = db.create(StoreName.User, otherItem)
    expect(db.getByIds(StoreName.User, [storedItem.id])).toEqual([storedItem])
    expect(db.getByIds(StoreName.User, [storedItem.id, storedOtherItem.id])).toEqual([
        storedItem,
        storedOtherItem,
    ])
})

test('created items can be found with getBy', () => {
    const db = new InMemoryDb()
    const storedItem = db.create(StoreName.User, item)
    db.create(StoreName.User, otherItem)
    expect(db.getBy(StoreName.User, (u: DbUser) => u.email === storedItem.email)).toEqual(
        storedItem,
    )
})

test('update updates items by id', () => {
    const db = new InMemoryDb()
    const storedItem = db.create(StoreName.User, item)
    const updatedItem = { ...otherItem, id: storedItem.id }
    db.update(StoreName.User, updatedItem)
    expect(db.getAll(StoreName.User)).toEqual([updatedItem])
})
