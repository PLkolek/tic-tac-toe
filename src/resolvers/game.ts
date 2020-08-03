import { Context } from "../utils";
import { ApiCoordinates, Board, Game as GameModel, GameResult, getBoard, getGameResult, omitPasswordHashFromUsers, Saved, UserData } from "../model"
import { UserRepository } from "../repositories/userRepository";

export const Game = {
    players: (parent: GameModel, args: void, { container }: Context): Saved<UserData>[] => {
        let dbUsers = container.get(UserRepository).getByIds(parent.playerIds);
        return omitPasswordHashFromUsers(dbUsers);
    }, //TODO move to service?
    moves: (parent: GameModel): ApiCoordinates[] =>
        parent.moves.map(([x, y]) => ({ x, y })),
    board: (parent: GameModel): Board => getBoard(parent.moves),
    result: (parent: GameModel): GameResult => getGameResult(parent.moves)

};
