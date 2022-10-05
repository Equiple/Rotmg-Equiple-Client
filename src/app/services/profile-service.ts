import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Gamemode, GameStatistic, PlayerProfile, ProfileService as ProfileServiceAPI } from "src/lib/api";

@Injectable()
export class ProfileService
{
    constructor(private profileServiceAPI: ProfileServiceAPI ){

    }
    getPlayerStats(playerId: string, mode: Gamemode): Observable<GameStatistic> {
        return this.profileServiceAPI.profileGetPlayerStatsGet(playerId, mode);
    }

    getPlayerProfile(playerId: string): Observable<PlayerProfile> {
        return this.profileServiceAPI.profileGetPlayerProfileGet(playerId);
    }
}


