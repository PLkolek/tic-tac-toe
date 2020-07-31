import { Context } from "../utils";

export const Query = {
    games: (parent: void, args: void, { gameRepository }: Context) =>
        gameRepository.getAll()
}
