import { Game, Saved } from "../model";
import { Service } from "typedi";

@Service({ global: true })
export class GameRepository {
    private games: Saved<Game>[] = [];
    private nextId: number = 1;

    public async create(game: Game): Promise<Saved<Game>> {
        const savedGame = { ...game, id: String(this.nextId++) };
        this.games.push(savedGame);
        return savedGame;
    }

    public async getAll(): Promise<Saved<Game>[]> {
        return this.games;
    }

    public async update(game: Saved<Game>): Promise<Saved<Game>> {
        const gameIndex = this.games.findIndex(this.byId(game.id));
        if (gameIndex != -1) {
            this.games[gameIndex] = game;
        } else {
            //TODO: fail here
            this.games.push(game);
        }
        return game
    }

    public async get(gameId: string): Promise<Saved<Game> | undefined> {
        return this.games.find(this.byId(gameId));
    }

    private byId(gameId: string) {
        return (g: Saved<Game>) => g.id == gameId
    }
}
