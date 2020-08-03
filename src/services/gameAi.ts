import { Board, getEmptyFields } from '../model/board'
import { BoardCoordinates } from '../model/boardCoordinates'
import { randomInt } from '../utils'

export const makeMove = (board: Board): BoardCoordinates => {
    const emptyFields = getEmptyFields(board)
    const randomIndex = randomInt(0, emptyFields.length)
    return emptyFields[randomIndex]
}
