import { BadRequestError, Context, GameOutput, MutationInput } from '../../utils'
import { ApiCoordinates, BoardCoordinate, boardCoordinates,  GameData } from "../../model";
import { GameService } from "../../services/gameService";

type CreateGameInput = {
    game: GameData
}

type JoinGameInput = {
    gameId: string
}

type MakeMoveInput = {
    gameId: string
    coordinates: ApiCoordinates
}

export const game = {
    createGame(_: void, { input: { game } }: MutationInput<CreateGameInput>, { container }: Context): GameOutput {
        return { game: container.get(GameService).createGameByLoggedInUser(game) };
    },

    joinGame(_: void, { input: { gameId } }: MutationInput<JoinGameInput>, { container }: Context): GameOutput {
        return { game: container.get(GameService).joinGameByIdByLoggedInUser(gameId) };
    },

    makeMove(_: void, { input: { gameId, coordinates } }: MutationInput<MakeMoveInput>, { container }: Context): GameOutput {
        const x = validateCoordinate(coordinates.x);
        const y = validateCoordinate(coordinates.y);
        return { game: container.get(GameService).makeMoveInGameByIdByLoggedInUser(gameId, [x, y]) };
    },

};

const validateCoordinate = (coordinate: number): BoardCoordinate => {
    if (!boardCoordinates.includes(coordinate as BoardCoordinate)) {
        throw new BadRequestError(`Coordinates must be one of the following values: ${boardCoordinates.join(", ")}`);
    }
    return coordinate as BoardCoordinate
};
