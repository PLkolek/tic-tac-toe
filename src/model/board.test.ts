import { emptyBoard, getBoard, getEmptyFields, getGameResultFromBoard } from './board'
import { PlayerSymbol } from './playerSymbol'
import { GameResult } from './gameResult'

describe('getBoard', () => {
    test('returns empty board if there are no moves', () => {
        expect(getBoard([])).toEqual(emptyBoard())
    })
    test('returns properly filled board, alternating player symbols on each move', () => {
        expect(
            getBoard([
                [0, 0],
                [1, 1],
                [2, 2],
            ]),
        ).toEqual([
            [PlayerSymbol.O, '_', '_'],
            ['_', PlayerSymbol.X, '_'],
            ['_', '_', PlayerSymbol.O],
        ])
    })
})

describe('getEmptyFields', () => {
    test('returns coordinates of empty fields on the board ', () => {
        expect(
            getEmptyFields([
                [PlayerSymbol.O, PlayerSymbol.O, PlayerSymbol.O],
                ['_', PlayerSymbol.X, PlayerSymbol.X],
                [PlayerSymbol.X, '_', PlayerSymbol.O],
            ]),
        ).toEqual([
            [0, 1],
            [1, 2],
        ])
    })
})

describe('getGameResultFromBoard', () => {
    describe('returns IN_PROGRESS if the game has not finished yet', () => {
        test('for empty board', () => {
            expect(getGameResultFromBoard(emptyBoard())).toBe(GameResult.InProgress)
        })
        test('for some not winning moves', () => {
            expect(
                getGameResultFromBoard([
                    [PlayerSymbol.O, '_', '_'],
                    ['_', PlayerSymbol.X, '_'],
                    ['_', '_', PlayerSymbol.O],
                ]),
            ).toBe(GameResult.InProgress)
        })
    })
    test('returns DRAW if the board is full and no one won', () => {
        expect(
            getGameResultFromBoard([
                [PlayerSymbol.O, PlayerSymbol.O, PlayerSymbol.X],
                [PlayerSymbol.X, PlayerSymbol.X, PlayerSymbol.O],
                [PlayerSymbol.O, PlayerSymbol.X, PlayerSymbol.O],
            ]),
        ).toBe(GameResult.Draw)
    })
    test('returns PLAYER_1_WON, well, when player 1 won', () => {
        expect(
            getGameResultFromBoard([
                [PlayerSymbol.O, PlayerSymbol.O, PlayerSymbol.O],
                [PlayerSymbol.X, PlayerSymbol.X, PlayerSymbol.O],
                [PlayerSymbol.X, PlayerSymbol.X, PlayerSymbol.O],
            ]),
        ).toBe(GameResult.Player1Won)
    })
    test('returns PLAYER_2_WON, well, when player 2 won', () => {
        expect(
            getGameResultFromBoard([
                [PlayerSymbol.O, PlayerSymbol.O, PlayerSymbol.X],
                [PlayerSymbol.X, PlayerSymbol.X, PlayerSymbol.O],
                [PlayerSymbol.X, PlayerSymbol.O, PlayerSymbol.O],
            ]),
        ).toBe(GameResult.Player2Won)
    })
})
