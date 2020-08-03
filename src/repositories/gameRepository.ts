import { Game, Saved } from "../model";
import { Service } from "typedi";

@Service({global: true})
export class GameRepository {
    private games: Saved<Game>[] = [];
    private nextId: number = 1;

    public create(game: Game): Saved<Game> {
        const savedGame = { ...game, id: String(this.nextId++) };
        this.games.push(savedGame);
        return savedGame;
    }

    public getAll(): Saved<Game>[] {
        return this.games;
    }

    public update(game: Saved<Game>): Saved<Game> {
        const gameIndex = this.games.findIndex(this.byId(game.id));
        if (gameIndex != -1) {
            this.games[gameIndex] = game;
        } else {
            //TODO: fail here
            this.games.push(game);
        }
        return game
    }

    public get(gameId: string): Saved<Game> | undefined {
        return this.games.find(this.byId(gameId));
    }

    private byId(gameId: string) {
        return (g: Saved<Game>) => g.id == gameId
    }
}
