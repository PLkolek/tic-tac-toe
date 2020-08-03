import { ContainerInstance } from 'typedi/ContainerInstance'

export type Context = {
    container: ContainerInstance
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super('Bad request: ' + message)
        Object.setPrototypeOf(this, BadRequestError.prototype)
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

export const randomInt = (startInclusive: number, endExclusive: number) =>
    startInclusive + Math.floor(Math.random() * (endExclusive - startInclusive))
