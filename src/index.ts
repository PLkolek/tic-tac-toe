import "reflect-metadata";
import { ApolloServer, PubSub } from 'apollo-server'
import resolvers from './resolvers'
import { Context } from "./utils";
import { AuthService } from "./services/authService";
import { schema } from "./schema";
import { Container } from "typedi";
import { v4 as uuidv4 } from 'uuid';

Container.set({
    global: true,
    type: PubSub,
    value: new PubSub()
});

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: ({ req }): Context => {
        if (!req) {
            console.log("Websocket")
        }

        const requestId = uuidv4();
        const container = Container.of(requestId);

        //if there is no request, it is a websocket connection (subscription) - no auth needed so far there
        const user = req ? container.get(AuthService).getLoggedInUserFromAuthHeader(req.header("Authorization")) : null;
        container.set("loggedInUser", user);
        return ({
            container
        });
    },
    plugins: [{
        requestDidStart: () => ({
            willSendResponse(requestContext) {
                requestContext.context.container.reset()
            }
        })
    }]
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
