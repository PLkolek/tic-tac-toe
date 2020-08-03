import { Context } from '../utils'
import { Game } from '../model/game'
import { Saved } from '../model/util'
import { SubscriptionResolver } from './resolverTypes'
import { GameOutput } from './commonApiTypes'
import { SubscriptionService } from '../services/subscriptionService'

export const Subscription: SubscriptionResolver = {
    gameEnded: {
        subscribe: (_parent, _args, { container }: Context): AsyncIterator<Game> => {
            return container.get(SubscriptionService).subscribeToGameEnded()
        },
        resolve: (game: Saved<Game>): GameOutput => ({ game }),
    },
}
