import { Context, MutationInput } from '../../utils'
import { Saved, UnsavedUser, UserData } from "../../model";

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

export const auth = {
    async signUp(_: void, { input: { user } }: MutationInput<SignUpInput>, { authService }: Context): Promise<AuthOutput> {
        return authService.signUp(user)
    },

    async login(_: void, { input: { passwordAuth } }: MutationInput<LogInInput>, { authService }: Context): Promise<AuthOutput> {
        return authService.login(passwordAuth.email, passwordAuth.password)
    },
}
