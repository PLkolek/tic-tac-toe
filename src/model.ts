export type Saved<T> = T & { id: string }

export type GameData = {
    name: string,
    type: GameType
}

export type Game = GameData & {
    playerIds: string[]
}

export type UserData = {
    email: string
}

export type UnsavedUser = UserData & {
    password: string
}

export type DbUser = UserData & {
    passwordHash: string
}

export const omitPasswordHash = <T extends DbUser>(dbUser: T): Omit<T, 'passwordHash'> => {
    const { passwordHash, ...user } = dbUser;
    return user
}

export const omitPasswordHashFromUsers = <T extends DbUser>(dbUsers: T[]): Omit<T, 'passwordHash'>[] =>
    dbUsers.map(omitPasswordHash)

export enum GameType {
    SinglePlayer = 'SINGLEPLAYER',
    MultiPlayer = 'MULTIPLAYER'
}

export type AuthUser = {
    userId: string
}
