import { Saved, UnsavedUser, UserData } from "../../model";
import { AuthService } from "../../services/authService";
import { MutationInput, MutationResolver } from "../types";

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
    async signUp(_parent, { input: { user } }: MutationInput<SignUpInput>, { container }): Promise<AuthOutput> {
        return container.get(AuthService).signUp(user)
    },

    async login(_parent, { input: { passwordAuth } }: MutationInput<LogInInput>, { container }): Promise<AuthOutput> {
        return container.get(AuthService).login(passwordAuth.email, passwordAuth.password)
    },
}
