import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Gamemode, GameOptions, GameService as GameServiceAPI, GuessResult, Hints, Item, PlayerProfile } from "src/lib/api";

@Injectable()
export class GameService {
    constructor(private gameServiceAPI: GameServiceAPI) {
        
    }

    findAll(searchInput: string, reskinsExcluded: boolean) : Observable<Item[]> {
        return this.gameServiceAPI.findAllGet(searchInput, reskinsExcluded);
    }

    checkGuess(itemId: string, mode: Gamemode, reskinsExcluded: boolean) : Observable<GuessResult> {
        return this.gameServiceAPI.checkGuessPost(itemId, mode, reskinsExcluded);
    }

    wasDailyAttempted() : Observable<boolean> {
        return this.gameServiceAPI.wasDailyAttemptedGet();
    }

    getTries() : Observable<number> {
        return this.gameServiceAPI.getTriesGet();
    }

    getGuesses() : Observable<Item[]> {
        return this.gameServiceAPI.getGuessesGet();
    }

    getGuess(itemId: string) : Observable<Item> {
        return this.gameServiceAPI.getGuessGet(itemId);
    }

    getHints(itemId: string) : Observable<Hints> {
        return this.gameServiceAPI.getHintsGet(itemId)
    }

    getAllHints() : Observable<Hints[]> {
        return this.gameServiceAPI.getAllHintsGet();
    }
    
    getActiveGameOptions() : Observable<GameOptions> {
        return this.gameServiceAPI.getActiveGameOptionsGet();
    }

    closeTheGame() : Observable<any> {
        return this.gameServiceAPI.closeTheGamePost();
    }

    getCurrentStreak(mode: Gamemode) : Observable<number> {
        return this.gameServiceAPI.getCurrentStreakGet(mode);
    }

    getBestStreak(mode: Gamemode): Observable<number> {
        return this.gameServiceAPI.getBestStreakGet(mode);
    }

    getTargetItem(): Observable<Item> {
        return this.gameServiceAPI.getTargetItemGet();
    }

    getNormalLeaderboard(): Observable<PlayerProfile[]> {
        return this.gameServiceAPI.getNormalLeaderboardGet();
    }

    getDailyLeaderboard(): Observable<PlayerProfile[]> {
        return this.gameServiceAPI.getDailyLeaderboardGet();
    }

    getPlayerLeaderboardPlacement(mode: Gamemode): Observable<number> {
        return this.gameServiceAPI.getPlayerLeaderboardPlacementGet(mode);
    }
}
