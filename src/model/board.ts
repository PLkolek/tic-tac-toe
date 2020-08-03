import { allBoardFields, BoardCoordinate, boardCoordinates, BoardCoordinates } from "./boardCoordinates";
import { firstPlayerSymbol, getPlayerSymbol, PlayerSymbol, secondPlayerSymbol } from "./playerSymbol";
import { GameResult } from "./gameResult";

export type FieldStatus = "_" | PlayerSymbol

export type Line = [FieldStatus, FieldStatus, FieldStatus]

export type Board = [Line, Line, Line]

export const emptyBoard = (): Board => {
    const makeRow = (): Line => ["_", "_", "_"];
    return [makeRow(), makeRow(), makeRow()]
};

export const getBoard = (moves: BoardCoordinates[]): Board => {
    const board = emptyBoard();
    moves.forEach(([x, y], index) => {
        board[y][x] = getPlayerSymbol(index % 2)
    });
    return board;
};

export const getRow = (board: Board, y: BoardCoordinate): Line => board[y];
export const getColumn = (board: Board, x: BoardCoordinate): Line => board.map(row => row[x]) as Line;
export const getMainDiagonal = (board: Board): Line => [board[0][0], board[1][1], board[2][2]];
export const getAntidiagonal = (board: Board): Line => [board[2][0], board[1][1], board[0][2]];
export const getAllRows = (board: Board): Line[] => board;
export const getAllColumns = (board: Board): Line[] => boardCoordinates.map(x => getColumn(board, x));
export const getAllLines = (board: Board): Line[] => [
    ...getAllRows(board),
    ...getAllColumns(board),
    getMainDiagonal(board),
    getAntidiagonal(board)
];


export const getEmptyFields = (board: Board): BoardCoordinates[] =>
    allBoardFields.filter(([x, y]) => board[y][x] === "_"); //TODO: extract const for "_"

export const getGameResultFromBoard = (board: Board): GameResult => {
    if (hasPlayerWon(board, firstPlayerSymbol)) {
        return GameResult.Player1Won
    }
    if (hasPlayerWon(board, secondPlayerSymbol)) {
        return GameResult.Player2Won
    }
    if (getEmptyFields(board).length === 0) {
        return GameResult.Draw
    }
    return GameResult.InProgress;
};

export const hasPlayerWon = (board: Board, playerSymbol: PlayerSymbol): boolean =>
    getAllLines(board).find(line => line.every(field => field === playerSymbol)) !== undefined;
