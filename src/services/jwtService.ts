import { Inject, Service } from 'typedi'
import * as jwt from 'jsonwebtoken'
import { AuthUser } from '../model/user'

@Service()
export class JwtService {
    constructor(@Inject('appSecret') private appSecret: string) {}

    public sign(userData: AuthUser): string {
        return jwt.sign(userData, this.appSecret)
    }

    public getLoggedInUserFromToken(token: string): AuthUser {
        return jwt.verify(token, this.appSecret) as AuthUser
    }

    public getLoggedInUserFromAuthHeader(header: string | undefined): AuthUser | null {
        if (header) {
            const token = header.replace(/^Bearer /, '')
            return this.getLoggedInUserFromToken(token)
        }
        return null
    }
}
