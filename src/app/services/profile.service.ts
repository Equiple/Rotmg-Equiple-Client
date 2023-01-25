import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DetailedGameStatistic, Gamemode, PlayerProfile, ProfileService as ProfileServiceAPI } from "src/lib/api";

@Injectable()
export class ProfileService {
    private userProfile : PlayerProfile = {};
    constructor(private profileServiceAPI: ProfileServiceAPI ){
    }

    getPlayerStats(mode: Gamemode): Observable<DetailedGameStatistic> {
        return this.profileServiceAPI.profileGetPlayerStatsGet(mode);
    }

    getPlayerProfile(): Observable<PlayerProfile> {
        return this.profileServiceAPI.profileGetPlayerProfileGet();
    }

    getUserProfile() {
        this.getPlayerProfile().subscribe(profile =>{
            if(profile){
                this.userProfile = profile;
            }
        });
    }

    getUser() {
        this.getUserProfile();
        return this.userProfile;
    }
}


