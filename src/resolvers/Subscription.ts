import { Context, GameOutput } from '../utils'
import { Game, Saved } from "../model";
import { PubSub } from 'apollo-server';

export const Subscription = {
    gameEnded: {
        subscribe: (_: void, __: void, { container }: Context): AsyncIterator<Game> => {
            return container.get(PubSub).asyncIterator<Game>("GameEnded") //TODO: extract constant
        },
        resolve: (game: Saved<Game>): GameOutput => ({ game })
    },
};
