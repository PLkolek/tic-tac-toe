import * as bcrypt from 'bcryptjs'
import { UserRepository } from '../repositories/userRepository'
import { Inject, Service } from 'typedi'
import Logger from 'bunyan'
import { omit } from '../utils'
import { DbUser, omitPasswordHash, UnsavedUser, UserData } from '../model/user'
import { Saved } from '../model/util'
import { JwtService } from './jwtService'

type AuthResult = {
    user: Saved<UserData>
    token: string
}

@Service()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        @Inject('unathenticatedLogger') private log: Logger,
        private jwtService: JwtService,
    ) {
        this.userRepository = userRepository
    }

    public async signUp(user: UnsavedUser): Promise<AuthResult> {
        const log = this.log.child({ user: omit(user, 'password') })
        log.info('Attempting to sign up')
        const passwordHash = await bcrypt.hash(user.password, 10)

        const savedUser = await this.userRepository.create({ email: user.email, passwordHash })
        log.info('Sign up successful')
        return this.authResponse(savedUser)
    }

    public async login(email: string, password: string): Promise<AuthResult> {
        const log = this.log.child({ email })
        log.info('Attempting to log in')
        const user = await this.userRepository.getByEmail(email)
        if (!user) {
            log.info('No user with such email found')
            throw new Error(`No user found for email: ${email}`)
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
            log.info('Invalid password')
            throw new Error('Invalid password')
        }

        log.info('Log in successful')
        return this.authResponse(user)
    }

    private authResponse(user: Saved<DbUser>): AuthResult {
        return {
            user: omitPasswordHash(user),
            token: this.tokenForUser(user),
        }
    }

    private tokenForUser(user: Saved<UserData>): string {
        return this.jwtService.sign({ userId: user.id })
    }
}
