import { ApolloServer, PubSub } from 'apollo-server'
import resolvers from './resolvers'
import { GameRepository } from "./repositories/gameRepository";
import { Context } from "./utils";
import { UserRepository } from "./repositories/userRepository";
import { AuthService } from "./services/authService";
import { GameService } from "./services/gameService";
import { schema } from "./schema";

const gameRepository = new GameRepository();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: ({ req }): Context => {
        //if there is no request, it is a websocket connection (subscription) - no auth needed so far there
        const user = req ? authService.getLoggedInUserFromAuthHeader(req.header("Authorization")) : undefined;
        const gameService = new GameService(gameRepository, pubsub, user);

        return ({
            user,
            userRepository,
            gameRepository,
            gameService,
            authService,
            pubsub
        });
    },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
