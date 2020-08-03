export type BoardCoordinate = 0 | 1 | 2
export type BoardCoordinates = [BoardCoordinate, BoardCoordinate]
export const boardCoordinates: [BoardCoordinate, BoardCoordinate, BoardCoordinate] = [0, 1, 2]
export const allBoardFields = boardCoordinates.flatMap((x) =>
    boardCoordinates.map((y): BoardCoordinates => [x, y]),
)

export const areCoordinatesEqual = ([x1, y1]: BoardCoordinates) => ([
    x2,
    y2,
]: BoardCoordinates): boolean => x1 === x2 && y1 === y2
