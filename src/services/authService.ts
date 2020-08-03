import { AuthUser, DbUser, omitPasswordHash, Saved, UnsavedUser, UserData } from "../model";
import * as bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/userRepository";
import * as jwt from 'jsonwebtoken'
import { Inject, Service } from "typedi";
import Logger from "bunyan";
import { omit } from "../utils";

type AuthResult = {
    user: Saved<UserData>
    token: string
}

@Service()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        @Inject("unathenticatedLogger") private log: Logger) {
        this.userRepository = userRepository;
    }

    public async signUp(user: UnsavedUser): Promise<AuthResult> {
        const log = this.log.child({ user: omit(user, 'password') })
        log.info("Attempting to sign up")
        const passwordHash = await bcrypt.hash(user.password, 10) //TODO: salt

        const savedUser = this.userRepository.create({ email: user.email, passwordHash });
        log.info("Sign up successful")
        return this.authResponse(savedUser);
    }

    public async login(email: string, password: string): Promise<AuthResult> {
        const log = this.log.child({ email })
        log.info("Attempting to log in")
        const user = this.userRepository.getByEmail(email)
        if (!user) {
            log.info("No user with such email found")
            throw new Error(`No user found for email: ${email}`)
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
            log.info("Invalid password")
            throw new Error('Invalid password') //TODO: Handle this error properly
        }

        log.info("Log in successful")
        return this.authResponse(user);
    }

    public getLoggedInUserFromAuthHeader(header: string | undefined): AuthUser | null {
        if (header) {
            const token = header.replace(/^Bearer /, "");
            return this.getLoggedInUserFromToken(token);
        }
        return null;
    }

    public getLoggedInUserFromToken(token: string): AuthUser {
        return jwt.verify(token, this.appSecret()) as AuthUser;
    }


    private authResponse(user: Saved<DbUser>): AuthResult {
        return {
            user: omitPasswordHash(user),
            token: this.tokenForUser(user)
        };
    }

    private tokenForUser(user: Saved<UserData>): string {
        return this.sign({ userId: user.id })
    }

    private sign(userData: AuthUser): string {
        return jwt.sign(userData, this.appSecret())
    }

    private appSecret(): string {
        //TODO: config injection? Remove that ??
        return process.env.APP_SECRET ?? "wololo";
    }

}
