import { Service } from 'typedi'
import { PubSub } from 'apollo-server'
import { Game } from '../model/game'

const gameEndedChannelId = 'GameEnded'

@Service()
export class SubscriptionService {
    constructor(private pubSub: PubSub) {}

    public subscribeToGameEnded(): AsyncIterator<Game> {
        return this.pubSub.asyncIterator<Game>(gameEndedChannelId)
    }

    public publishGameEnded(game: Game): void {
        this.pubSub.publish(gameEndedChannelId, game)
    }
}
