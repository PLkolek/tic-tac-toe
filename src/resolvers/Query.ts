import { GameRepository } from "../repositories/gameRepository";
import { Game } from "../model/game";
import { Saved } from "../model/util";
import { Resolver } from "./resolverTypes";

export const Query: Resolver<void> = {
    games: (parent: void, args: {}, { container }): Promise<Saved<Game>[]> =>
        container.get(GameRepository).getAll()
}
