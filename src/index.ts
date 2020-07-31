import { GraphQLServer } from 'graphql-yoga'
import resolvers from './resolvers'
import { GameRepository } from "./repositories/gameRepository";
import { Context } from "./utils";
import { UserRepository } from "./repositories/userRepository";
import { AuthService } from "./services/authService";
import { GameService } from "./services/gameService";

const gameRepository = new GameRepository();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: ({ request }): Context => {
        const user = authService.getLoggedInUserFromAuthHeader(request.header("Authorization"));
        const gameService = new GameService(gameRepository, user);

        return ({
            user,
            userRepository,
            gameRepository,
            gameService,
            authService
        });
    },
});

server.start(() => console.log(`Server is running on http://localhost:4000`))
