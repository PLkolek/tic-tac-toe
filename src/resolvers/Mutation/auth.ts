import { Context, MutationInput } from '../../utils'
import { Saved, UnsavedUser, UserData } from "../../model";
import { AuthService } from "../../services/authService";

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
    async signUp(_: void, { input: { user } }: MutationInput<SignUpInput>, { container }: Context): Promise<AuthOutput> {
        return container.get(AuthService).signUp(user)
    },

    async login(_: void, { input: { passwordAuth } }: MutationInput<LogInInput>, { container }: Context): Promise<AuthOutput> {
        return container.get(AuthService).login(passwordAuth.email, passwordAuth.password)
    },
}
