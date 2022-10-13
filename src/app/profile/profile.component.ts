import { Component, OnInit } from '@angular/core';
import { GameStatistic, PlayerProfile } from 'src/lib/api';
import { GameService } from '../services/game-service';
import { ProfileService } from '../services/profile-service';
import { StatField } from './statField';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  player: PlayerProfile = {};
  stats: GameStatistic[] = [];
  private readonly playerId = '63468622d01c82bd9efc0598';
  readonly statFields = [
    { title: "Daily", color: "bg-primary", icon: "" },
    { title: "Normal", color: "bg-info", icon: "" },
    { title: "Total", color: "bg-warning", icon: "" }
  ];
  readonly attrFields: StatField[] = [
    { key: "bestRun", title: "Best run:" },
    { key: "bestGuess", title: "Best guess:" },
    { key: "runsLost", title: "Runs lost:" },
    { key: "runsWon", title: "Runs won:" },
    { key: "currentStreak", title: "Current Streak:" },
    { key: "bestStreak", title: "Best streak:" }
  ];
  constructor(private gameService: GameService, private profileService: ProfileService) {
  }

  ngOnInit(): void {
    this.profileService.getPlayerProfile(this.playerId).subscribe(playerProfile => {
      if (playerProfile) {
        this.player = playerProfile;
        this.stats.push(playerProfile.dailyStats!);
        this.stats.push(playerProfile.normalStats!);
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
}
