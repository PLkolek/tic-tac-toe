import { GraphQLServer, PubSub } from 'graphql-yoga'
import resolvers from './resolvers'
import { GameRepository } from "./repositories/gameRepository";
import { Context } from "./utils";
import { UserRepository } from "./repositories/userRepository";
import { AuthService } from "./services/authService";
import { GameService } from "./services/gameService";

const gameRepository = new GameRepository();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: ({ request }): Context => {
        //if there is no request, it is a websocket connection (subscription) - no auth needed so far there
        const user = request ? authService.getLoggedInUserFromAuthHeader(request.header("Authorization")) : undefined;
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

server.start(() => console.log(`Server is running on http://localhost:4000`));
