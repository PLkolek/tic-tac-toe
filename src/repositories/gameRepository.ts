import { Game, Saved } from "../model";

export class GameRepository {
    private games: Saved<Game>[] = [];
    private nextId: number = 1;

    public create(game: Game): Saved<Game> {
        const savedGame = { ...game, id: String(this.nextId++) }
        this.games.push(savedGame);
        return savedGame;
    }

    public getAll(): Saved<Game>[] {
        return this.games;
    }

    update(game: Saved<Game>) {
        const gameIndex = this.games.findIndex(this.byId(game.id))
        if (gameIndex != -1) {
            this.games[gameIndex] = game;
        } else {
            this.games.push(game);
        }
    }

    get(gameId: string): Saved<Game> | undefined {
        return this.games.find(this.byId(gameId));
    }

    private byId(gameId: string) {
        return (g: Saved<Game>) => g.id == gameId
    }
}
