import { Query } from './Query'
import { game } from "./Mutation/game";
import { auth } from "./Mutation/auth";
import { Game } from "./Game";
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
