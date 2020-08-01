import { areCoordinatesEqual, AuthUser, BoardCoordinates, Game, GameData, GameResult, GameType, getBoard, getGameResult, Saved } from "../model";
import { GameRepository } from "../repositories/gameRepository";
import { AuthorizationError, BadRequestError } from "../utils";
import * as AI from "./gameAi"
import { PubSub } from "apollo-server";

export class GameService {
    private gameRepository: GameRepository;
    private pubsub: PubSub;
    private loggedInUser: AuthUser | undefined;

    constructor(gameRepository: GameRepository, pubsub: PubSub, loggedInUser: AuthUser | undefined) {
        this.gameRepository = gameRepository;
        this.pubsub = pubsub;
        this.loggedInUser = loggedInUser;
    }

    public createGameByLoggedInUser(game: GameData): Saved<Game> {
        return this.createGameBy(game, this.getLoggedInUserOrFail().userId)
    }

    public createGameBy(game: GameData, userId: string): Saved<Game> {
        return this.gameRepository.create({ ...game, playerIds: [userId], moves: [] })
    }

    public joinGameByIdByLoggedInUser(gameId: string): Saved<Game> {
        return this.joinGameById(gameId, this.getLoggedInUserOrFail().userId);
    }

    public joinGameById(gameId: string, userId: string): Saved<Game> {
        return this.joinGame(this.getGameOrFail(gameId), userId);
    }

    public joinGame(game: Saved<Game>, userId: string): Saved<Game> {
        if (game.type == GameType.SinglePlayer) {
            throw new BadRequestError(`Game "${game.name}" is a single player game. Try joining a multi player game instead.`)
        }
        if (game.playerIds.indexOf(userId) != -1) {
            return game;
        }
        if (game.playerIds.length >= 2) {
            throw new BadRequestError(`Game "${game.name}" is full. Try joining another game.`)
        }
        const updatedGame = { ...game, playerIds: [...game.playerIds, userId] };
        this.gameRepository.update(updatedGame);
        return updatedGame;
    }

    public makeMoveInGameByIdByLoggedInUser(gameId: string, coordinates: BoardCoordinates): Saved<Game> {
        return this.makeMoveInGameById(gameId, this.getLoggedInUserOrFail().userId, coordinates);
    }

    public makeMoveInGameById(gameId: string, userId: string, coordinates: BoardCoordinates): Saved<Game> {
        return this.makeMove(this.getGameOrFail(gameId), userId, coordinates);
    }

    public makeMove(game: Saved<Game>, userId: string, coordinates: BoardCoordinates): Saved<Game> {
        //TODO: extract, split
        const playerNumber = game.playerIds.indexOf(userId);
        if (playerNumber == -1) {
            throw new BadRequestError(`Player ${userId} is not a member of game ${game.name}. Please join game before making moves.`)
        }
        if (game.moves.length % 2 != playerNumber) {
            throw new BadRequestError(`It's not a turn of player ${userId} in game ${game.name}. Please wait for your turn.`)
        }
        if (game.moves.find(areCoordinatesEqual(coordinates))) {
            throw new BadRequestError(`Field [${coordinates[0]}, ${coordinates[1]}] is already occupied game in ${game.name}. Please make move at a free field`)
        }
        const gameResult = getGameResult(game.moves);
        if (gameResult !== GameResult.InProgress) {
            throw new BadRequestError(`Game ${game.name} has already ended with result ${gameResult}. Please make a move in an unfinished game`);
        }

        const updatedGame = { ...game, moves: [...game.moves, coordinates] };
        const gameResultAfterMove = getGameResult(updatedGame.moves);
        if (game.type === GameType.SinglePlayer && gameResultAfterMove === GameResult.InProgress) {
            const aiMove = AI.makeMove(getBoard(updatedGame.moves)); //TODO: shorten this
            updatedGame.moves.push(aiMove)
        }
        const finalGame = this.gameRepository.update(updatedGame);
        const finalResult = getGameResult(finalGame.moves);
        if (finalResult !== GameResult.InProgress) {
            this.pubsub.publish("GameEnded", finalGame);
        }

        return finalGame;
    }

    private getGameOrFail(gameId: string): Saved<Game> {
        const game = this.gameRepository.get(gameId);
        if (!game) {
            throw new BadRequestError(`Game ${gameId} doesn't exist. Please provide a valid game id.`)
        }
        return game;
    }

    private getLoggedInUserOrFail(): AuthUser {
        if (!this.loggedInUser) {
            throw new AuthorizationError("You have to be logged in to create a game");
        }
        return this.loggedInUser;
    }
}
