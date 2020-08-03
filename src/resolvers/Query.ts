import { Context } from "../utils";
import { GameRepository } from "../repositories/gameRepository";

export const Query = {
    games: (parent: void, args: {}, { container }: Context) =>
        container.get(GameRepository).getAll()
}
