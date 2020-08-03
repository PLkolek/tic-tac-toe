import { Board, getEmptyFields } from "../model/board";
import { BoardCoordinates } from "../model/boardCoordinates";

export const makeMove = (board: Board): BoardCoordinates => {
    const emptyFields = getEmptyFields(board);
    const randomIndex = Math.floor(Math.random() * emptyFields.length); //TODO: extract helper
    return emptyFields[randomIndex]
};
