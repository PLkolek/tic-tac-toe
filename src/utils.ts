import { GameRepository } from "./repositories/gameRepository";
import { AuthService } from "./services/authService";
import { AuthUser, Game, Saved } from "./model";
import { GameService } from "./services/gameService";
import { UserRepository } from "./repositories/userRepository";
import { PubSub } from "graphql-yoga";

export interface Context {
    userRepository: UserRepository
    gameRepository: GameRepository
    gameService: GameService
    authService: AuthService
    user: AuthUser | undefined
    pubsub: PubSub
}

export type MutationInput<T> = {
    input: T
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super("Bad request: " + message);
    }
}

export class AuthorizationError extends Error {
    constructor(message: string) {
        super("Authorization error: " + message);
    }
}

export type GameOutput = {
    game: Saved<Game>
}
