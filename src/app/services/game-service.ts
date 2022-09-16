import { Injectable } from "@angular/core";
import { tick } from "@angular/core/testing";
import { Observable } from "rxjs";
import { Gamemode, GameOptions, GameService as GameServiceAPI, GuessResult, Hints, Item, Player } from "src/lib/api";

@Injectable()
export class GameService {
    constructor(private gameServiceAPI: GameServiceAPI) {
        
    }

    findAll(searchInput: string, reskinsExcluded: boolean) : Observable<Item[]> {
        return this.gameServiceAPI.findAllGet(searchInput, reskinsExcluded);
    }

    checkGuess(itemId: string, playerId: string, mode: Gamemode, reskinsExcluded: boolean) : Observable<GuessResult> {
        return this.gameServiceAPI.checkGuessPost(itemId, playerId, mode, reskinsExcluded);
    }

    wasDailyAttempted(playerId: string) : Observable<boolean> {
        return this.gameServiceAPI.wasDailyAttemptedGet(playerId);
    }

    getTries(playerId: string) : Observable<number> {
        return this.gameServiceAPI.getTriesGet(playerId);
    }

    getGuesses(playerId: string) : Observable<Item[]> {
        return this.gameServiceAPI.getGuessesGet(playerId);
    }

    getGuess(itemId: string) : Observable<Item> {
        return this.gameServiceAPI.getGuessGet(itemId);
    }

    getHints(playerId: string, itemId: string) : Observable<Hints> {
        return this.gameServiceAPI.getHintsGet(playerId, itemId)
    }

    getAllHints(playerId: string) : Observable<Hints[]> {
        return this.gameServiceAPI.getAllHintsGet(playerId);
    }

    createNewPlayer(name: string, password: string, email: string) : Observable<any> {
        return this.gameServiceAPI.createNewPlayerPut(name, password, email);
    }
    
    getActiveGameOptions(playerId: string) : Observable<GameOptions> {
        return this.gameServiceAPI.getActiveGameOptionsGet(playerId);
    }

    closeTheGame(playerId: string) : Observable<any> {
        return this.gameServiceAPI.closeTheGamePost(playerId);
    }

    getCurrentStreak(playerId: string) : Observable<number> {
        return this.gameServiceAPI.getCurrentStreakGet(playerId);
    }

    getPlayer(playerId: string) : Observable<Player> {
        return this.gameServiceAPI.getPlayerGet(playerId)
    }
}
