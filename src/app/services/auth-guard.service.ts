import { Injectable } from "@angular/core";
import { CanLoad, Route, Router } from "@angular/router";
import { ProfileService } from "./profile.service";

@Injectable()
export class AuthGuardService implements CanLoad{
    constructor(private router: Router, private profileService: ProfileService){

    }

    canLoad(route: Route): boolean{
        let url: string = route.path!;
        if(url === 'complaints' && this.profileService.getUser().role === "admin"){
            return true;
        }
        return false;
    }
}