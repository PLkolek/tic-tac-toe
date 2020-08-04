import { areCoordinatesEqual, BoardCoordinates } from './boardCoordinates'
import { GameResult } from './gameResult'
import { getBoard, getGameResultFromBoard } from './board'

export type GameData = {
    name: string
    type: GameType
}

export type Game = GameData & {
    playerIds: string[]
    moves: BoardCoordinates[]
}

export enum GameType {
    SinglePlayer = 'SINGLEPLAYER',
    MultiPlayer = 'MULTIPLAYER',
}

export const getGameResult = (game: Game): GameResult =>
    getGameResultFromBoard(getBoard(game.moves))

export const addMove = <T extends Game>(game: T, coordinates: BoardCoordinates): T => ({
    ...game,
    moves: [...game.moves, coordinates],
})

// Validations should return some enum with ErrorType instead of just string cause,
// but as it would require some boring boilerplate switches just to provide a message
// to the log and to the exception, it's fine as it is for now.
export const validateMove = (
    game: Game,
    userId: string,
    coordinates: BoardCoordinates,
): string | null => {
    const playerNumber = game.playerIds.indexOf(userId)
    if (playerNumber == -1) {
        return `Player ${userId} is not a member of game ${game.name}. Please join game before making moves.`
    }
    if (game.moves.length % 2 != playerNumber) {
        return `It's not a turn of player ${userId} in game ${game.name}. Please wait for your turn.`
    }
    if (game.moves.find(areCoordinatesEqual(coordinates))) {
        return `Field [${coordinates[0]}, ${coordinates[1]}] is already occupied game in ${game.name}. Please make move at a free field`
    }
    const gameResult = getGameResult(game)
    if (gameResult !== GameResult.InProgress) {
        return `Game ${game.name} has already ended with result ${gameResult}. Please make a move in an unfinished game`
    }
    return null
}

export const validateJoiningGame = (game: Game, userId: string): string | null => {
    if (game.type == GameType.SinglePlayer) {
        return `Game "${game.name}" is a single player game. Try joining a multi player game instead.`
    }
    if (game.playerIds.indexOf(userId) != -1) {
        return `User already present in game ${game.name}`
    }
    if (game.playerIds.length >= 2) {
        return `Game "${game.name}" is full. Try joining another game.`
    }
    return null
}
