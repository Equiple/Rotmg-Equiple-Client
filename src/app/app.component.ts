import { Component, OnInit } from '@angular/core';
import { GuideComponent } from './guide/guide.component';
import { Dialog } from '@angular/cdk/dialog';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ReportABugComponent } from './report-a-bug/report-a-bug.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private dialog: Dialog) { }

    ngOnInit() {
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
