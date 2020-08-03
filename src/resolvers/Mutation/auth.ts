import { AuthService } from '../../services/authService'
import { UnsavedUser, UserData } from '../../model/user'
import { Saved } from '../../model/util'
import { MutationInput, MutationResolver } from '../resolverTypes'

type SignUpInput = {
    user: UnsavedUser
}

type AuthOutput = {
    user: Saved<UserData>
    token: string
}

type PasswordAuthInput = {
    email: string
    password: string
}

type LogInInput = {
    passwordAuth: PasswordAuthInput
}

export const auth: MutationResolver = {
    async signUp(
        _parent,
        { input: { user } }: MutationInput<SignUpInput>,
        { container },
    ): Promise<AuthOutput> {
        return container.get(AuthService).signUp(user)
    },

    async login(
        _parent,
        { input: { passwordAuth } }: MutationInput<LogInInput>,
        { container },
    ): Promise<AuthOutput> {
        return container.get(AuthService).login(passwordAuth.email, passwordAuth.password)
    },
}
