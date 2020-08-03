import { UserRepository } from '../repositories/userRepository'
import { Saved } from '../model/util'
import { omitPasswordHashFromUsers, UserData } from '../model/user'
import { Board, getBoard } from '../model/board'
import { GameResult } from '../model/gameResult'
import { Game as GameModel, getGameResult } from '../model/game'
import { Resolver } from './resolverTypes'
import { ApiCoordinates } from './commonApiTypes'

export const Game: Resolver<GameModel> = {
    players: async (parent, _args: {}, { container }): Promise<Saved<UserData>[]> => {
        const dbUsers = await container.get(UserRepository).getByIds(parent.playerIds)
        return omitPasswordHashFromUsers(dbUsers)
    }, //TODO move to service?
    moves: (parent): ApiCoordinates[] => parent.moves.map(([x, y]) => ({ x, y })),
    board: (parent): Board => getBoard(parent.moves),
    result: (parent: GameModel): GameResult => getGameResult(parent),
}
