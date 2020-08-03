import { Service } from 'typedi'
import { InMemoryDb, StoreName } from './inMemoryDb'
import { BaseRepository } from './baseRepository'

@Service()
export class GameRepository extends BaseRepository<StoreName.Game> {
    constructor(db: InMemoryDb) {
        super(db, StoreName.Game)
    }
}
