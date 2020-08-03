import { BadRequestError, GameOutput } from '../../utils'
import { ApiCoordinates, BoardCoordinate, boardCoordinates, GameData } from "../../model";
import { GameService } from "../../services/gameService";
import { MutationInput, MutationResolver } from "../types";

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

export const game: MutationResolver = {
    createGame(_parent: void, { input: { game } }: MutationInput<CreateGameInput>, { container }): GameOutput {
        return { game: container.get(GameService).createGameByLoggedInUser(game) };
    },

    joinGame(_parent: void, { input: { gameId } }: MutationInput<JoinGameInput>, { container }): GameOutput {
        return { game: container.get(GameService).joinGameByIdByLoggedInUser(gameId) };
    },

    makeMove(_parent: void, { input: { gameId, coordinates } }: MutationInput<MakeMoveInput>, { container }): GameOutput {
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
