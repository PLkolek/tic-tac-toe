import { BoardCoordinates } from './boardCoordinates'
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
