import { ApiCoordinates, Board, Game as GameModel, GameResult, getBoard, getGameResult, omitPasswordHashFromUsers, Saved, UserData } from "../model"
import { UserRepository } from "../repositories/userRepository";
import { Resolver } from "./types";

export const Game: Resolver<GameModel> = {
    players: (parent, _args: {}, { container }): Saved<UserData>[] => {
        let dbUsers = container.get(UserRepository).getByIds(parent.playerIds);
        return omitPasswordHashFromUsers(dbUsers);
    }, //TODO move to service?
    moves: (parent): ApiCoordinates[] =>
        parent.moves.map(([x, y]) => ({ x, y })),
    board: (parent): Board => getBoard(parent.moves),
    result: (parent: GameModel): GameResult => getGameResult(parent.moves)

};
