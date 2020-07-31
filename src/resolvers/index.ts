import { Query } from './Query'
import { game } from "./Mutation/game";
import { auth } from "./Mutation/auth";
import { Game } from "./game";
import { Subscription } from "./Subscription";

export default {
    Query,
    Mutation: {
        ...game
        , ...auth
    },
    Subscription,
    Game
}
