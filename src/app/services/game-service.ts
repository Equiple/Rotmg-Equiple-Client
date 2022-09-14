import { Injectable } from "@angular/core";
import { tick } from "@angular/core/testing";
import { Observable } from "rxjs";
import { Gamemode, GameService as GameServiceAPI, GuessResult, Hints, Item } from "src/lib/api";

@Injectable()
export class GameService {
    constructor(private gameServiceAPI: GameServiceAPI) {
        
    }

    findAll(searchInput: string): Observable<Item[]> {
        return this.gameServiceAPI.findAllGet(searchInput);
    }

    checkGuess(itemId: string, playerId: string, mode: Gamemode): Observable<GuessResult> {
        return this.gameServiceAPI.checkGuessPost(itemId, playerId, mode);
    }

    wasDailyAttempted(playerId: string): Observable<boolean> {
        return this.gameServiceAPI.wasDailyAttemptedGet(playerId);
    }

    getTries(playerId: string): Observable<number> {
        return this.gameServiceAPI.getTriesGet(playerId);
    }

    getGuesses(playerId: string): Observable<Item[]> {
        return this.gameServiceAPI.getGuessesGet(playerId);
    }

    getGuess(itemId: string): Observable<Item> {
        return this.gameServiceAPI.getGuessGet(itemId);
    }

    getHints(playerId: string, itemId: string): Observable<Hints> {
        return this.gameServiceAPI.getHintsGet(playerId, itemId)
    }

    getAllHints(playerId: string): Observable<Hints[]> {
        return this.gameServiceAPI.getAllHintsGet(playerId);
    }

    createNewPlayer(name: string, password: string, email: string) : Observable<any> {
        return this.gameServiceAPI.createNewPlayerPut(name, password, email);
    }
    
    getActiveGamemode(playerId: string) : Observable<Gamemode> {
        return this.gameServiceAPI.getActiveGamemodeGet(playerId);
    }
}
