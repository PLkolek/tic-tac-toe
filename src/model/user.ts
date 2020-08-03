import { omit } from "../utils";

export type UserData = {
    email: string
}

export type UnsavedUser = UserData & {
    password: string
}

export type DbUser = UserData & {
    passwordHash: string
}

export type AuthUser = {
    userId: string
}

export const omitPasswordHash = <T extends DbUser>(dbUser: T): Omit<T, 'passwordHash'> => omit(dbUser, 'passwordHash')

export const omitPasswordHashFromUsers = <T extends DbUser>(dbUsers: T[]): Omit<T, 'passwordHash'>[] =>
    dbUsers.map(omitPasswordHash);
