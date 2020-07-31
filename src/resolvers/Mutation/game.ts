import { Context, MutationInput } from '../../utils'
import { Game, GameData, Saved } from "../../model";

type CreateGameInput = {
    game: GameData
}

type JoinGameInput = {
    gameId: string
}

type GameOutput = {
    game: Saved<Game>
}

export const game = {
    createGame(_: void, { input: { game } }: MutationInput<CreateGameInput>, { gameService }: Context): GameOutput {
        return { game: gameService.createGameByLoggedInUser(game) };
    },

    joinGame(_: void, { input: { gameId } }: MutationInput<JoinGameInput>, { gameService }: Context): GameOutput {
        return { game: gameService.joinGameByIdByLoggedInUser(gameId) };
    },

}
