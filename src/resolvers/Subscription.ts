import { Context, GameOutput } from '../utils'
import { Game, Saved } from "../model";
import { PubSub } from 'apollo-server';
import { SubscriptionResolver } from "./types";

export const Subscription: SubscriptionResolver = {
    gameEnded: {
        subscribe: (_parent, _args, { container }: Context): AsyncIterator<Game> => {
            return container.get(PubSub).asyncIterator<Game>("GameEnded") //TODO: extract constant
        },
        resolve: (game: Saved<Game>): GameOutput => ({ game })
    },
};
