import { Inject, Service } from 'typedi'
import * as jwt from 'jsonwebtoken'
import { AuthUser } from '../model/user'
import { AuthenticationError } from 'apollo-server'

@Service()
export class JwtService {
    constructor(@Inject('appSecret') private appSecret: string) {}

    public sign(userData: AuthUser): string {
        return jwt.sign(userData, this.appSecret, { expiresIn: '1h' })
    }

    public getLoggedInUserFromToken(token: string): AuthUser {
        try {
            return jwt.verify(token, this.appSecret) as AuthUser
        } catch (jwtError) {
            throw new AuthenticationError(jwtError.message)
        }
    }

    public getLoggedInUserFromAuthHeader(header: string | undefined): AuthUser | null {
        if (header) {
            const token = header.replace(/^Bearer /, '')
            return this.getLoggedInUserFromToken(token)
        }
        return null
    }
}
