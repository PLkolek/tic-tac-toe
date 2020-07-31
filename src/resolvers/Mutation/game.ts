import { BadRequestError, Context, GameOutput, MutationInput } from '../../utils'
import { ApiCoordinates, BoardCoordinate, boardCoordinates,  GameData } from "../../model";

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
    createGame(_: void, { input: { game } }: MutationInput<CreateGameInput>, { gameService }: Context): GameOutput {
        return { game: gameService.createGameByLoggedInUser(game) };
    },

    joinGame(_: void, { input: { gameId } }: MutationInput<JoinGameInput>, { gameService }: Context): GameOutput {
        return { game: gameService.joinGameByIdByLoggedInUser(gameId) };
    },

    makeMove(_: void, { input: { gameId, coordinates } }: MutationInput<MakeMoveInput>, { gameService }: Context): GameOutput {
        const x = validateCoordinate(coordinates.x);
        const y = validateCoordinate(coordinates.y);
        return { game: gameService.makeMoveInGameByIdByLoggedInUser(gameId, [x, y]) };
    },

};

const validateCoordinate = (coordinate: number): BoardCoordinate => {
    if (!boardCoordinates.includes(coordinate as BoardCoordinate)) {
        throw new BadRequestError(`Coordinates must be one of the following values: ${boardCoordinates.join(", ")}`);
    }
    return coordinate as BoardCoordinate
};
