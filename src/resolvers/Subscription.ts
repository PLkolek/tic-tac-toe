import { Context } from '../utils'
import { PubSub } from 'apollo-server'
import { Game } from '../model/game'
import { Saved } from '../model/util'
import { SubscriptionResolver } from './resolverTypes'
import { GameOutput } from './commonApiTypes'

export const Subscription: SubscriptionResolver = {
    gameEnded: {
        subscribe: (_parent, _args, { container }: Context): AsyncIterator<Game> => {
            return container.get(PubSub).asyncIterator<Game>('GameEnded') //TODO: extract constant
        },
        resolve: (game: Saved<Game>): GameOutput => ({ game }),
    },
}
