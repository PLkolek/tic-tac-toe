import { GameRepository } from "../repositories/gameRepository";
import { Resolver } from "./types";
import { Game, Saved } from "../model";

export const Query: Resolver<void> = {
    games: (parent: void, args: {}, { container }): Promise<Saved<Game>[]> =>
        container.get(GameRepository).getAll()
}
