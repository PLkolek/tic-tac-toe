import 'reflect-metadata'
import { ApolloServer, PubSub } from 'apollo-server'
import resolvers from './resolvers'
import { Context } from './utils'
import { Container } from 'typedi'
import { v4 as uuidv4 } from 'uuid'
import * as bunyan from 'bunyan'
import Logger from 'bunyan'
import { JwtService } from './services/jwtService'
import { rootSchema } from './schema/root'
import { authSchema } from './schema/auth'
import { gameSchema } from './schema/game'

Container.set({
    global: true,
    type: PubSub,
    value: new PubSub(),
})

const appSecret = process.env.APP_SECRET
if (!appSecret) {
    throw new Error(
        'APP_SECRET environment variable is absent, please set it for JWT signing and verification.',
    )
}

Container.set({
    global: true,
    id: 'appSecret',
    value: appSecret,
})

const rootLogger = bunyan.createLogger({ name: 'tic-tac-toe' })

const server = new ApolloServer({
    typeDefs: [rootSchema, authSchema, gameSchema],
    resolvers,
    context: ({ req }): Context => {
        const requestId = uuidv4()
        const container = Container.of(requestId)
        container.set('unathenticatedLogger', rootLogger.child({ requestId }))

        //if there is no request, it is a websocket connection (subscription) - no auth needed so far there
        const user = req
            ? container.get(JwtService).getLoggedInUserFromAuthHeader(req.header('Authorization'))
            : null
        container.set('loggedInUser', user)

        container.set({
            type: Logger,
            value: rootLogger.child({ requestId, loggedInUserEmail: user?.email }),
        })

        return {
            container,
        }
    },
    plugins: [
        {
            requestDidStart: () => ({
                willSendResponse(requestContext) {
                    requestContext.context.container.reset()
                },
            }),
        },
    ],
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
