export enum PlayerSymbol {
    X = 'X',
    O = 'O',
}

export const firstPlayerSymbol = PlayerSymbol.O
export const secondPlayerSymbol = PlayerSymbol.X

export const getPlayerSymbol = (playerNumber: number): PlayerSymbol => {
    if (playerNumber === 0) {
        return firstPlayerSymbol
    } else {
        return secondPlayerSymbol
    }
}
