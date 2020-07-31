import { Context } from "../utils";
import { ApiCoordinates, Board, Game as GameModel, getBoard, omitPasswordHashFromUsers, Saved, UserData } from "../model"

export const Game = {
    players: (parent: GameModel, args: void, { userRepository }: Context): Saved<UserData>[] =>
        omitPasswordHashFromUsers(userRepository.getByIds(parent.playerIds)), //TODO move to service?
    moves: (parent: GameModel): ApiCoordinates[] =>
        parent.moves.map(([x, y]) => ({ x, y })),
    board: (parent: GameModel): Board => getBoard(parent.moves)

};
