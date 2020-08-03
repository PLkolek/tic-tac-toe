import { BadRequestError} from '../../utils'
import { GameService } from "../../services/gameService";
import { GameData } from "../../model/game";
import { BoardCoordinate, boardCoordinates } from "../../model/boardCoordinates";
import { MutationInput, MutationResolver } from "../resolverTypes";
import { ApiCoordinates, GameOutput } from "../commonApiTypes";

type CreateGameInput = {
    game: GameData
}

type JoinGameInput = {
    gameId: string
}

type MakeMoveInput = {
    gameId: string
    coordinates: ApiCoordinates;
}

export const game: MutationResolver = {
    createGame(_parent: void, { input: { game } }: MutationInput<CreateGameInput>, { container }): Promise<GameOutput> {
        return container.get(GameService).createGameByLoggedInUser(game).then(game => ({ game }))
    },

    joinGame(_parent: void, { input: { gameId } }: MutationInput<JoinGameInput>, { container }): Promise<GameOutput> {
        return container.get(GameService).joinGameByIdByLoggedInUser(gameId).then(game => ({ game }))
    },

    makeMove(_parent: void, { input: { gameId, coordinates } }: MutationInput<MakeMoveInput>, { container }): Promise<GameOutput> {
        const x = validateCoordinate(coordinates.x);
        const y = validateCoordinate(coordinates.y);
        return container.get(GameService).makeMoveInGameByIdByLoggedInUser(gameId, [x, y]).then(game => ({ game }));
    },

};

const validateCoordinate = (coordinate: number): BoardCoordinate => {
    if (!boardCoordinates.includes(coordinate as BoardCoordinate)) {
        throw new BadRequestError(`Coordinates must be one of the following values: ${boardCoordinates.join(", ")}`);
    }
    return coordinate as BoardCoordinate
};
