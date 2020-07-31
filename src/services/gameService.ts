import { AuthUser, Game, GameData, GameType, Saved } from "../model";
import { GameRepository } from "../repositories/gameRepository";
import { AuthorizationError, BadRequestError } from "../utils";

export class GameService {
    private gameRepository: GameRepository;
    private loggedInUser: AuthUser | undefined;

    constructor(gameRepository: GameRepository, loggedInUser: AuthUser | undefined) {
        this.gameRepository = gameRepository;
        this.loggedInUser = loggedInUser;
    }

    public createGameByLoggedInUser(game: GameData): Saved<Game> {
        if (!this.loggedInUser) {
            throw new AuthorizationError("You have to be logged in to create a game");
        }
        return this.createGameBy(game, this.loggedInUser.userId)
    }

    public createGameBy(game: GameData, userId: string): Saved<Game> {
        return this.gameRepository.create({ ...game, playerIds: [userId] })
    }

    public joinGameByIdByLoggedInUser(gameId: string): Saved<Game> {
        if (!this.loggedInUser) {
            throw new AuthorizationError("You have to be logged in to join a game");
        }
        return this.joinGameById(gameId, this.loggedInUser.userId);
    }

    public joinGameById(gameId: string, userId: string): Saved<Game> {
        const game = this.gameRepository.get(gameId);
        if (!game) {
            throw new BadRequestError(`Game ${gameId} doesn't exist. Please provide a valid game id.`)
        }
        return this.joinGame(game, userId);
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
        const updatedGame = { ...game, playerIds: [...game.playerIds, userId] }
        this.gameRepository.update(updatedGame);
        return updatedGame;
    }
}
