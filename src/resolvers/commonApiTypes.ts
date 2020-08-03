import { Saved } from '../model/util'
import { Game } from '../model/game'

export type ApiCoordinates = {
    x: number
    y: number
}
export type GameOutput = {
    game: Saved<Game>
}
