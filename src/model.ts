import { omit } from "./utils";

export type Saved<T> = T & { id: string }

export type GameData = {
    name: string,
    type: GameType
}

export type BoardCoordinate = 0 | 1 | 2
export type BoardCoordinates = [BoardCoordinate, BoardCoordinate]
export const boardCoordinates: [BoardCoordinate, BoardCoordinate, BoardCoordinate] = [0, 1, 2];
export const allBoardFields = boardCoordinates.flatMap(x =>
    boardCoordinates.map((y): BoardCoordinates =>
        [x, y]
    )
);

export const areCoordinatesEqual = ([x1, y1]: BoardCoordinates) => ([x2, y2]: BoardCoordinates): boolean =>
    x1 === x2 && y1 === y2;

export type Game = GameData & {
    playerIds: string[]
    moves: BoardCoordinates[]
}

export enum PlayerSymbol {
    X = "X",
    O = "O"
}

export const firstPlayerSymbol = PlayerSymbol.O;
export const secondPlayerSymbol = PlayerSymbol.X;

export type FieldStatus = "_" | PlayerSymbol

export const getPlayerSymbol = (playerNumber: number): PlayerSymbol => {
    if (playerNumber === 0) {
        return firstPlayerSymbol
    } else {
        return secondPlayerSymbol
    }
};

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

export enum GameResult {
    Player1Won = "PLAYER_1_WON",
    Player2Won = "PLAYER_2_WON",
    Draw = "DRAW",
    InProgress = "IN_PROGRESS"
}

export const getGameResult = (moves: BoardCoordinates[]): GameResult => {
    const board = getBoard(moves);
    if (hasPlayerWon(board, firstPlayerSymbol)) {
        return GameResult.Player1Won
    }
    if (hasPlayerWon(board, secondPlayerSymbol)) {
        return GameResult.Player2Won
    }
    if (moves.length === 9) {
        return GameResult.Draw
    }
    return GameResult.InProgress;
};

export const hasPlayerWon = (board: Board, playerSymbol: PlayerSymbol): boolean =>
    getAllLines(board).find(line => line.every(field => field === playerSymbol)) !== undefined;

export type UserData = {
    email: string
}

export type UnsavedUser = UserData & {
    password: string
}

export type DbUser = UserData & {
    passwordHash: string
}

export const omitPasswordHash = <T extends DbUser>(dbUser: T): Omit<T, 'passwordHash'> => omit(dbUser, 'passwordHash')

export const omitPasswordHashFromUsers = <T extends DbUser>(dbUsers: T[]): Omit<T, 'passwordHash'>[] =>
    dbUsers.map(omitPasswordHash);

export enum GameType {
    SinglePlayer = 'SINGLEPLAYER',
    MultiPlayer = 'MULTIPLAYER'
}

export type AuthUser = {
    userId: string
}

export type ApiCoordinates = {
    x: number,
    y: number
}
