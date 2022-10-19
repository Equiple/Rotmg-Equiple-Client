import { Component, OnInit } from '@angular/core';
import { Gamemode, GameStatistic, PlayerProfile } from 'src/lib/api';
import { ProfileService } from '../services/profile.service';
import { getPlayerStats } from '../utils/helperFunctions';

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
    public stats: DisplayGameStatistic[] = [];
    
    public readonly statFields = [
        { title: "Daily", color: "bg-primary", icon: "" },
        { title: "Normal", color: "bg-info", icon: "" },
        { title: "Total", color: "bg-warning", icon: "" }
    ];
    
    public readonly attrFields: StatField[] = [
        { key: "bestRun", title: "Best run:" },
        { key: "bestGuess", title: "Best guess:" },
        { key: "runsLost", title: "Runs lost:" },
        { key: "runsWon", title: "Runs won:" },
        { key: "currentStreak", title: "Current Streak:" },
        { key: "bestStreak", title: "Best streak:" }
    ];

    public player?: PlayerProfile;

    constructor(private profileService: ProfileService) {
    }

    public ngOnInit(): void {
        this.profileService.getPlayerProfile().subscribe(playerProfile => {
            if (playerProfile) {
                this.player = playerProfile;
                this.stats.push(this.getDisplayStats(playerProfile, Gamemode.Daily));
                this.stats.push(this.getDisplayStats(playerProfile, Gamemode.Normal));
                let bestGuess = "";
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
        });
    }

    private getDisplayStats(playerProfile: PlayerProfile, gamemode: Gamemode): DisplayGameStatistic {
        const stats = getPlayerStats(playerProfile, gamemode);

        return {
            ...stats.gameStatistic!,
            bestGuess: stats.bestGuessItem?.name || ""
        };
    }
}
