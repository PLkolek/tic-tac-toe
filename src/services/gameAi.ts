import { Board, BoardCoordinates, getEmptyFields } from "../model";

export const makeMove = (board: Board): BoardCoordinates => {
    const emptyFields = getEmptyFields(board);
    const randomIndex = Math.floor(Math.random() * emptyFields.length); //TODO: extract helper
    return emptyFields[randomIndex]
};
