import { gql } from 'apollo-server'

export const gameSchema = gql`
    extend type Query {
        games: [Game!]!
    }

    extend type Mutation {
        createGame(input: CreateGameInput!): GamePayload!
        joinGame(input: JoinGameInput!): GamePayload!
        makeMove(input: MakeMoveInput!): GamePayload!
    }

    extend type Subscription {
        gameEnded: GamePayload!
    }

    input CreateGameInput {
        game: GameInput!
    }

    input JoinGameInput {
        gameId: String!
    }

    input MakeMoveInput {
        gameId: String!
        coordinates: CoordinatesInput!
    }

    input CoordinatesInput {
        x: Int!
        y: Int!
    }

    type GamePayload {
        game: Game
    }

    input GameInput {
        name: String!
        type: GameType!
    }

    type Game {
        id: ID!
        name: String!
        type: GameType!
        players: [User!]!
        result: GameResult
        moves: [Coordinates!]!
        board: [[FieldState!]!]!
    }

    enum GameType {
        SINGLEPLAYER
        MULTIPLAYER
    }

    type Coordinates {
        x: Int!
        y: Int!
    }

    enum FieldState {
        X
        O
        _
    }

    enum GameResult {
        PLAYER_1_WON
        PLAYER_2_WON
        DRAW
        IN_PROGRESS
    }
`
