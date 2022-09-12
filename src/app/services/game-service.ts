import { tick } from "@angular/core/testing";
import { Observable } from "rxjs";
import { GameService as GameServiceAPI, Item } from "src/lib/api";


export class GameService {
    constructor(private gameServiceAPI: GameServiceAPI) {
        
    }

    findAll(searchInput: string): Observable<Item[]> {
        return this.gameServiceAPI.findAllGet(searchInput);
    }

    startNormal(itemId: string, playerId: string): Observable<any> {
        return this.gameServiceAPI.startNormalPost(itemId, playerId);
    }

    startDaily(itemId: string, playerId: string): Observable<any> {
        return this.gameServiceAPI.startDailyPost(itemId, playerId);
    }

    checkGuess(itemId: string, playerId: string): Observable<any> {
        return this.gameServiceAPI.checkGuessPost(itemId, playerId);
    }

    wasDailyAttempted(playerId: string): Observable<any>{
        return this.gameServiceAPI.checkGuessPost(playerId);
    }

    getTries(playerId: string): Observable<any>{
        return this.gameServiceAPI.getTriesGet(playerId);
    }

    getGuesses(playerId: string): Observable<any>{
        return this.gameServiceAPI.getGuessesGet(playerId);
    }

    getGuess(itemId: string): Observable<any>{
        return this.gameServiceAPI.getGuessGet(itemId);
    }

    getTargetItemName(playerId: string): Observable<any>{
        return this.gameServiceAPI.getTargetItemNameGet(playerId);
    }

    hasAnActiveGame(playerId: string): Observable<any>{
        return this.gameServiceAPI.hasAnActiveGameGet(playerId);
    }

    getHints(playerId: string, itemId: string): Observable<any>{
        return this.gameServiceAPI.getHintsGet(playerId, itemId)
    }

    getAllHints(playerId: string): Observable<any>{
        return this.gameServiceAPI.getAllHintsGet(playerId);
    }

    
}
