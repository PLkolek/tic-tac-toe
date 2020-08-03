import { Board, getBoard, getEmptyFields } from '../model/board'
import { BoardCoordinates } from '../model/boardCoordinates'
import { randomInt } from '../utils'
import { addMove, Game } from '../model/game'

export const getMove = (board: Board): BoardCoordinates => {
    const emptyFields = getEmptyFields(board)
    const randomIndex = randomInt(0, emptyFields.length)
    return emptyFields[randomIndex]
}

export const makeMove = <T extends Game>(game: T): T => {
    const aiMove = getMove(getBoard(game.moves))
    return addMove(game, aiMove)
}
