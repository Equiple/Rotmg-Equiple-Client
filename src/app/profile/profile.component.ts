import { Component, Input, OnInit } from '@angular/core';
import { Gamemode, GameStatistic, PlayerProfile } from 'src/lib/api';
import { ProfileService } from '../services/profile.service';
import { getPlayerStats } from '../utils/helperFunctions';
import { CookieService } from '../services/cookie.service';

interface DisplayGameStatistic extends Omit<GameStatistic, 'bestGuessItemId'> {
    bestGuess: string
}

interface StatField {
    key: keyof DisplayGameStatistic,
    title: string
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    playerProfile?: PlayerProfile;
    colorblindMode: boolean = false;

    public stats: DisplayGameStatistic[] = [];

    public readonly statFields = [
        { title: 'Daily', color: 'bg-primary', icon: '' },
        { title: 'Normal', color: 'bg-info', icon: '' },
        { title: 'Total', color: 'bg-warning', icon: '' }
    ];

    public readonly attrFields: StatField[] = [
        { key: 'bestRun', title: 'Best run:' },
        { key: 'bestGuess', title: 'Best guess:' },
        { key: 'runsLost', title: 'Runs lost:' },
        { key: 'runsWon', title: 'Runs won:' },
        { key: 'currentStreak', title: 'Current Streak:' },
        { key: 'bestStreak', title: 'Best streak:' }
    ];

    constructor(private profileService: ProfileService, private cookieService: CookieService) {
        if (this.cookieService.doesCookieExist('colorblind')) {
            this.colorblindMode = (this.cookieService.getCookie('colorblind') === 'true');
        }
    }

    public changeColorblindMode() {
        let aa = this.colorblindMode;
        this.cookieService.setCookie('colorblind', '' + this.colorblindMode, 3650);
    }

    public getDateInFormat() {
        let tIndex = this.playerProfile?.registrationDate?.date?.indexOf('T');
        return this.playerProfile?.registrationDate?.date?.slice(0, tIndex);
    }

    public async ngOnInit() {
        this.playerProfile = await this.profileService.getPlayerProfile();
        this.stats.push(this.getDisplayStats(this.playerProfile!, Gamemode.Daily));
        this.stats.push(this.getDisplayStats(this.playerProfile!, Gamemode.Normal));
        let bestGuess = '';
        if (this.stats[0].bestRun! < this.stats[1].bestRun!) {
            bestGuess = this.stats[0].bestGuess!;
        } else {
            bestGuess = this.stats[1].bestGuess!;
        }
        this.stats.push({
            bestRun: Math.min(this.stats[0].bestRun!, this.stats[1].bestRun!),
            bestGuess: bestGuess,
            runsLost: this.stats[0].runsLost! + this.stats[1].runsLost!,
            runsWon: this.stats[0].runsWon! + this.stats[1].runsWon!,
            bestStreak: Math.max(this.stats[0].bestStreak!, this.stats[1].bestStreak!),
            currentStreak: 0
        });
    }

    private getDisplayStats(playerProfile: PlayerProfile, gamemode: Gamemode): DisplayGameStatistic {
        let tempStats = getPlayerStats(playerProfile, gamemode);
        if (tempStats === null || tempStats === undefined) {
            let dap: DisplayGameStatistic =
            {
                bestRun: 10,
                runsLost: 0,
                runsWon: 0,
                currentStreak: 0,
                bestStreak: 0,
                bestGuess: ''
            };
            return dap;
        }
        return {
            ...tempStats.gameStatistic!,
            bestGuess: tempStats.bestGuessItem?.name || ''
        };
    }
}
