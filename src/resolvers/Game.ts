import { Saved } from '../model/util'
import { UserData } from '../model/user'
import { Board, getBoard } from '../model/board'
import { GameResult } from '../model/gameResult'
import { Game as GameModel, getGameResult } from '../model/game'
import { Resolver } from './resolverTypes'
import { ApiCoordinates } from './commonApiTypes'
import { UserService } from '../services/userService'

export const Game: Resolver<GameModel> = {
    players: (parent, _args: {}, { container }): Promise<Saved<UserData>[]> =>
        container.get(UserService).getByIds(parent.playerIds),
    moves: (parent): ApiCoordinates[] => parent.moves.map(([x, y]) => ({ x, y })),
    board: (parent): Board => getBoard(parent.moves),
    result: (parent: GameModel): GameResult => getGameResult(parent),
}
