import { Game, Saved } from "./model";
import { ContainerInstance } from "typedi/ContainerInstance";

export interface Context {
    container: ContainerInstance
}

export type MutationInput<T> = {
    input: T
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super("Bad request: " + message);
    }
}

export class AuthorizationError extends Error {
    constructor(message: string) {
        super("Authorization error: " + message);
    }
}

export type GameOutput = {
    game: Saved<Game>
}

export const omit = <T, Property extends keyof T>(obj: T, property: Property): Omit<T, Property> => {
    const { [property]: _, ...objWithoutProperty } = obj;
    return objWithoutProperty
};
