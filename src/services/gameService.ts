import { areCoordinatesEqual, AuthUser, BoardCoordinates, Game, GameData, GameResult, GameType, getBoard, getGameResult, Saved } from "../model";
import { GameRepository } from "../repositories/gameRepository";
import { AuthorizationError, BadRequestError } from "../utils";
import * as AI from "./gameAi"
import { PubSub } from "apollo-server";
import { Inject, Service } from "typedi";
import Logger from "bunyan";

@Service()
export class GameService {
    constructor(private gameRepository: GameRepository,
                private pubsub: PubSub,
                @Inject("loggedInUser") private loggedInUser: AuthUser | null,
                private logger: Logger
    ) {
    }

    public createGameByLoggedInUser(game: GameData): Saved<Game> {
        return this.createGameBy(game, this.getLoggedInUserOrFail().userId)
    }

    public createGameBy(game: GameData, userId: string): Saved<Game> {
        this.logger.info({ game, userId }, "Creating game");
        return this.gameRepository.create({ ...game, playerIds: [userId], moves: [] })
    }

    public joinGameByIdByLoggedInUser(gameId: string): Saved<Game> {
        return this.joinGameById(gameId, this.getLoggedInUserOrFail().userId);
    }

    public joinGameById(gameId: string, userId: string): Saved<Game> {
        return this.joinGame(this.getGameOrFail(gameId), userId);
    }

    public joinGame(game: Saved<Game>, userId: string): Saved<Game> {
        this.logger.info({ game, userId }, "Attempting to join game");
        if (game.type == GameType.SinglePlayer) {
            this.logger.info({ game, userId }, "Cannot join, the game is single player");
            throw new BadRequestError(`Game "${game.name}" is a single player game. Try joining a multi player game instead.`)
        }
        if (game.playerIds.indexOf(userId) != -1) {
            this.logger.info({ game, userId }, "User already present in the game");
            return game;
        }
        if (game.playerIds.length >= 2) {
            this.logger.info({ game, userId }, "Cannot join, the game is full");
            throw new BadRequestError(`Game "${game.name}" is full. Try joining another game.`)
        }
        const updatedGame = { ...game, playerIds: [...game.playerIds, userId] };
        this.gameRepository.update(updatedGame);
        this.logger.info({ game, userId }, "Game joined");
        return updatedGame;
    }

    public makeMoveInGameByIdByLoggedInUser(gameId: string, coordinates: BoardCoordinates): Saved<Game> {
        return this.makeMoveInGameById(gameId, this.getLoggedInUserOrFail().userId, coordinates);
    }

    public makeMoveInGameById(gameId: string, userId: string, coordinates: BoardCoordinates): Saved<Game> {
        return this.makeMove(this.getGameOrFail(gameId), userId, coordinates);
    }

    public makeMove(game: Saved<Game>, userId: string, coordinates: BoardCoordinates): Saved<Game> {
        this.logger.info({ game, coordinates, userId }, "Attempting to make move in game");
        //TODO: extract, split
        const playerNumber = game.playerIds.indexOf(userId);
        if (playerNumber == -1) {
            this.logger.info({ game, userId }, "Cannot make move, player not member of the game");
            throw new BadRequestError(`Player ${userId} is not a member of game ${game.name}. Please join game before making moves.`)
        }
        if (game.moves.length % 2 != playerNumber) {
            this.logger.info({ game, userId }, "Cannot make move, it's not the player's turn");
            throw new BadRequestError(`It's not a turn of player ${userId} in game ${game.name}. Please wait for your turn.`)
        }
        if (game.moves.find(areCoordinatesEqual(coordinates))) {
            this.logger.info({ game, userId, coordinates }, "Cannot make move, field is occupied already");
            throw new BadRequestError(`Field [${coordinates[0]}, ${coordinates[1]}] is already occupied game in ${game.name}. Please make move at a free field`)
        }
        const gameResult = getGameResult(game.moves);
        if (gameResult !== GameResult.InProgress) {
            this.logger.info({ game, userId }, "Cannot make move, game has ended");
            throw new BadRequestError(`Game ${game.name} has already ended with result ${gameResult}. Please make a move in an unfinished game`);
        }

        this.logger.info({ game, userId, coordinates }, "Making move in the game");
        const updatedGame = { ...game, moves: [...game.moves, coordinates] };
        const gameResultAfterMove = getGameResult(updatedGame.moves);
        if (game.type === GameType.SinglePlayer && gameResultAfterMove === GameResult.InProgress) {
            this.logger.info({ game, userId }, "AI is making move in the game");
            const aiMove = AI.makeMove(getBoard(updatedGame.moves)); //TODO: shorten this
            updatedGame.moves.push(aiMove)
        }
        const finalGame = this.gameRepository.update(updatedGame);
        const finalResult = getGameResult(finalGame.moves);
        if (finalResult !== GameResult.InProgress) {
            this.logger.info({ game, userId, result: finalResult }, "Game has ended");
            this.pubsub.publish("GameEnded", finalGame);
        }

        this.logger.info({ game, userId, coordinates }, "The has been made");
        return finalGame;
    }

    private getGameOrFail(gameId: string): Saved<Game> {
        const game = this.gameRepository.get(gameId);
        if (!game) {
            this.logger.info({ gameId }, "The game doesn't exist");
            throw new BadRequestError(`Game ${gameId} doesn't exist. Please provide a valid game id.`)
        }
        return game;
    }

    private getLoggedInUserOrFail(): AuthUser {
        if (!this.loggedInUser) {
            this.logger.info("User is not logged in");
            throw new AuthorizationError("You have to be logged in to perform this operation");
        }
        return this.loggedInUser;
    }
}
