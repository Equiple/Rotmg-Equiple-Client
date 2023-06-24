import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { GameStatisticDetailed, Gamemode, PlayerProfile, ProfileService as ProfileServiceAPI } from "src/lib/api";

@Injectable()
export class ProfileService {
    private playerProfile? : PlayerProfile;
    constructor(private profileServiceAPI: ProfileServiceAPI ) {
    }

    getPlayerStats(mode: Gamemode): Promise<GameStatisticDetailed> {
        return lastValueFrom(this.profileServiceAPI.profileGetPlayerStatsGet(mode));
    }

    public async loadPlayerProfile() {
        this.playerProfile = await lastValueFrom(this.profileServiceAPI.profileGetPlayerProfileGet());
    }

    public async getPlayerProfile() {
        if (this.playerProfile === null || this.playerProfile === undefined) {
            await this.loadPlayerProfile();
        }
        return this.playerProfile;
    }
}


