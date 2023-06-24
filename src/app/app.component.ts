import { Component, OnInit } from '@angular/core';
import { GuideComponent } from './guide/guide.component';
import { Dialog } from '@angular/cdk/dialog';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ReportABugComponent } from './report-a-bug/report-a-bug.component';
import { PlayerProfile } from 'src/lib/api';
import { ProfileService } from './services/profile.service';
import { CookieService } from './services/cookie.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public playerProfile?: PlayerProfile;

    constructor(private dialog: Dialog, 
        private profileService: ProfileService) { 
    }

    async ngOnInit() {
        await this.profileService.loadPlayerProfile();
        this.playerProfile = await this.profileService.getPlayerProfile();
    }

    showGuideModal(): void {
        this.dialog.open(GuideComponent);
    }

    showLeaderboardModal() {
        this.dialog.open(LeaderboardComponent);
    }

    showReportABugModal() {
        this.dialog.open(ReportABugComponent);
    }
}
