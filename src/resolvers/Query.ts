import { Context } from "../utils";
import { GameRepository } from "../repositories/gameRepository";

export const Query = {
    games: (parent: void, args: void, { container }: Context) =>
        container.get(GameRepository).getAll()
}
