import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { PlayerProfile } from 'src/lib/api';
import { GameService } from '../services/game.service';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
    leaderboard: PlayerProfile[] = [];
    currentGamemode = 'Daily';
    bgColor = '-danger';
    readonly playerPlaces = [
        { key: '0', color: 'table-warning', icon: 'star-fill' },
        { key: '1', color: 'table-secondary', icon: 'asterisk' },
        { key: '2', color: 'table-primary', icon: 'heart-arrow' }
    ];

    constructor(private gameService: GameService, private dialogRef: DialogRef<string>) {
    }

    ngOnInit(): void {
        this.changeMode('Daily');
    }

    close() {
        this.dialogRef.close();
    }

    getPlayerNameColor(index: number) {
        if (this.leaderboard[index].role === 'guest') {
            return '';
        }
        return '';
    }

    getPlayerBgColor(index: number): string {
        if (index < 3) {
            return this.playerPlaces[index].color;
        }
        return '';
    }

    getMedal(index: number) {
        if (index === 0) {
            return '🥇';
        } else if (index === 1) {
            return '🥈';
        } else if (index === 2) {
            return '🥉';
        }
        return '';
    }

    changeMode(gamemode: string) {
        this.currentGamemode = gamemode;
        if (gamemode === 'Daily') {
            this.gameService.getDailyLeaderboard().subscribe(leaderboard => {
                if (leaderboard) {
                    this.leaderboard = leaderboard;
                }
            });
            this.bgColor = '-danger';
        } else {
            this.gameService.getNormalLeaderboard().subscribe(leaderboard => {
                if (leaderboard) {
                    this.leaderboard = leaderboard;
                }
            });
            this.bgColor = '-info';
        }
    }
}
