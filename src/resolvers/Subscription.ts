import { Context, GameOutput } from '../utils'
import { Game, Saved } from "../model";

export const Subscription = {
    gameEnded: {
        subscribe: (_: void, __: void, { pubsub }: Context): AsyncIterator<Game> => {
            return pubsub.asyncIterator<Game>("GameEnded") //TODO: extract constant
        },
        resolve: (game: Saved<Game>): GameOutput => ({ game })
    },
};
