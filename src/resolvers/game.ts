import { Context } from "../utils";
import { Game as GameModel, omitPasswordHashFromUsers } from "../model"

export const Game = {
    players: (parent: GameModel, args: void, { userRepository }: Context) =>
        omitPasswordHashFromUsers(userRepository.getByIds(parent.playerIds)) //TODO move to service?
}
