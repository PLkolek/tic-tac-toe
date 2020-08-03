import { ContainerInstance } from 'typedi/ContainerInstance'

export type Context = {
    container: ContainerInstance
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super('Bad request: ' + message)
    }
}

export class AuthorizationError extends Error {
    constructor(message: string) {
        super('Authorization error: ' + message)
    }
}

export const omit = <T, Property extends keyof T>(
    obj: T,
    property: Property,
): Omit<T, Property> => {
    const { [property]: _, ...objWithoutProperty } = obj
    return objWithoutProperty
}
