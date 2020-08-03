import { Inject, Service } from 'typedi'
import Logger from 'bunyan'
import { omit } from '../utils'
import { UnsavedUser, UserData } from '../model/user'
import { Saved } from '../model/util'
import { JwtService } from './jwtService'
import { UserService } from './userService'
import { UserInputError } from 'apollo-server'

type AuthResult = {
    user: Saved<UserData>
    token: string
}

@Service()
export class AuthService {
    constructor(
        private userService: UserService,
        @Inject('unathenticatedLogger') private log: Logger,
        private jwtService: JwtService,
    ) {}

    public async signUp(user: UnsavedUser): Promise<AuthResult> {
        const log = this.log.child({ user: omit(user, 'password') })
        log.info('Attempting to sign up')
        const savedUser = await this.userService.create(user)
        log.info('Sign up successful')
        return this.authResponse(savedUser)
    }

    public async login(email: string, password: string): Promise<AuthResult> {
        const log = this.log.child({ email })
        log.info('Attempting to log in')

        const user = await this.userService.getByEmailAndPassword(email, password)
        if (!user) {
            log.info('Invalid email or password')
            throw new UserInputError('Invalid email or password')
        }

        log.info('Log in successful')
        return this.authResponse(user)
    }

    private authResponse(user: Saved<UserData>): AuthResult {
        return {
            user: user,
            token: this.tokenForUser(user),
        }
    }

    private tokenForUser(user: Saved<UserData>): string {
        return this.jwtService.sign({ email: user.email, sub: user.id })
    }
}
