import { Injectable } from "@angular/core";
import { CanLoad, Route, Router } from "@angular/router";
import { ProfileService } from "./profile.service";

/*
    Guards selected routes from 
*/
@Injectable()
export class AuthGuardService implements CanLoad{

    constructor(private router: Router, private profileService: ProfileService){
    }

    async canLoad(route: Route) {
        let url: string = route.path!;
        let userProfile = await this.profileService.getPlayerProfile();
        if (url === 'complaints' && userProfile!.role === 'admin') {
            return true;
        }
        return false;
    }
}