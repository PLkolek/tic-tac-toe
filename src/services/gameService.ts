import { GameRepository } from '../repositories/gameRepository'
import { AuthorizationError, BadRequestError } from '../utils'
import * as AI from './gameAi'
import { Inject, Service } from 'typedi'
import Logger from 'bunyan'
import { AuthUser } from '../model/user'
import {
    addMove,
    Game,
    GameData,
    GameType,
    getGameResult,
    validateJoiningGame,
    validateMove,
} from '../model/game'
import { BoardCoordinates } from '../model/boardCoordinates'
import { Saved } from '../model/util'
import { GameResult } from '../model/gameResult'
import { SubscriptionService } from './subscriptionService'

@Service()
export class GameService {
    constructor(
        private gameRepository: GameRepository,
        private subscriptionService: SubscriptionService,
        @Inject('loggedInUser') private loggedInUser: AuthUser | null,
        private logger: Logger,
    ) {}

    public createGameByLoggedInUser(game: GameData): Promise<Saved<Game>> {
        return this.createGameBy(game, this.getLoggedInUserOrFail().userId)
    }

    public createGameBy(game: GameData, userId: string): Promise<Saved<Game>> {
        this.logger.info({ game, userId }, 'Creating game')
        return this.gameRepository.create({ ...game, playerIds: [userId], moves: [] })
    }

    public joinGameByIdByLoggedInUser(gameId: string): Promise<Saved<Game>> {
        return this.joinGameById(gameId, this.getLoggedInUserOrFail().userId)
    }

    public async joinGameById(gameId: string, userId: string): Promise<Saved<Game>> {
        const game = await this.getGameOrFail(gameId)
        return this.joinGame(game, userId)
    }

    public joinGame(game: Saved<Game>, userId: string): Promise<Saved<Game>> {
        this.logger.info({ game, userId }, 'Attempting to join game')
        this.validateJoiningGame(game, userId)
        const gameWithAddedPlayer = { ...game, playerIds: [...game.playerIds, userId] }
        const updatedGame = this.gameRepository.update(gameWithAddedPlayer)
        this.logger.info({ game, userId }, 'Game joined')
        return updatedGame
    }

    public makeMoveInGameByIdByLoggedInUser(
        gameId: string,
        coordinates: BoardCoordinates,
    ): Promise<Saved<Game>> {
        return this.makeMoveInGameById(gameId, this.getLoggedInUserOrFail().userId, coordinates)
    }

    public async makeMoveInGameById(
        gameId: string,
        userId: string,
        coordinates: BoardCoordinates,
    ): Promise<Saved<Game>> {
        const game = await this.getGameOrFail(gameId)
        return this.makeMove(game, userId, coordinates)
    }

    public async makeMove(
        game: Saved<Game>,
        userId: string,
        coordinates: BoardCoordinates,
    ): Promise<Saved<Game>> {
        this.logger.info({ game, coordinates, userId }, 'Attempting to make move in game')
        this.validateMove(game, userId, coordinates)

        this.logger.info({ game, userId, coordinates }, 'Making move in the game')
        let updatedGame = addMove(game, coordinates)
        updatedGame = this.makeAIMoveIfNeeded(updatedGame, userId)
        const finalGame = await this.gameRepository.update(updatedGame)
        this.triggerNotificationIfGameEnded(finalGame, userId)

        this.logger.info({ game, userId, coordinates }, 'The has been made')
        return finalGame
    }

    private triggerNotificationIfGameEnded(game: Game, userId: string) {
        const finalResult = getGameResult(game)
        if (finalResult !== GameResult.InProgress) {
            this.logger.info({ game, userId, result: finalResult }, 'Game has ended')
            this.subscriptionService.publishGameEnded(game)
        }
    }

    private makeAIMoveIfNeeded(game: Saved<Game>, userId: string) {
        const gameResultAfterMove = getGameResult(game)
        if (game.type === GameType.SinglePlayer && gameResultAfterMove === GameResult.InProgress) {
            this.logger.info({ game, userId }, 'AI is making move in the game')
            return AI.makeMove(game)
        }
        return game
    }

    private validateMove(game: Game, userId: string, coordinates: BoardCoordinates) {
        const invalidMoveCause = validateMove(game, userId, coordinates)
        if (invalidMoveCause) {
            this.logger.info({ game, coordinates, userId }, invalidMoveCause)
            throw new BadRequestError(invalidMoveCause)
        }
    }

    private validateJoiningGame(game: Game, userId: string) {
        const invalidJoinCause = validateJoiningGame(game, userId)
        if (invalidJoinCause) {
            this.logger.info({ game, userId }, invalidJoinCause)
            throw new BadRequestError(invalidJoinCause)
        }
    }

    private async getGameOrFail(gameId: string): Promise<Saved<Game>> {
        const game = await this.gameRepository.get(gameId)
        if (!game) {
            this.logger.info({ gameId }, "The game doesn't exist")
            throw new BadRequestError(
                `Game ${gameId} doesn't exist. Please provide a valid game id.`,
            )
        }
        return game
    }

    private getLoggedInUserOrFail(): AuthUser {
        if (!this.loggedInUser) {
            this.logger.info('User is not logged in')
            throw new AuthorizationError('You have to be logged in to perform this operation')
        }
        return this.loggedInUser
    }
}
