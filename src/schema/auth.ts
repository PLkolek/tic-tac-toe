import { gql } from 'apollo-server'

export const authSchema = gql`
    extend type Mutation {
        signUp(input: SignUpInput!): AuthPayload!
        login(input: LogInInput): AuthPayload!
    }

    input SignUpInput {
        user: UserInput!
    }

    input UserInput {
        email: String!
        password: String!
    }

    input LogInInput {
        passwordAuth: PasswordAuthInput!
    }

    input PasswordAuthInput {
        email: String!
        password: String!
    }

    type AuthPayload {
        token: String
        user: User
    }

    type User {
        id: ID!
        email: String!
    }
`
