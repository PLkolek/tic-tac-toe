import { Board, BoardCoordinates, getEmptyFields } from "../model";

export const makeMove = (board: Board): BoardCoordinates => {
    const emptyFields = getEmptyFields(board);
    const randomIndex = Math.floor(Math.random() * emptyFields.length); //extract helper
    return emptyFields[randomIndex]
};
