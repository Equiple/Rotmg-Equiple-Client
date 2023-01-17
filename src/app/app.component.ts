import { Component, OnInit } from '@angular/core';
import { Item, Hints, Gamemode } from 'src/lib/api';
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
  guesses = new Array<Item>();
  hints = new Array<Hints>();
  gamemode = Gamemode.Daily;
  gameEnded = false;
  excludeReskins = false;
  changeAllowed = true;
  guessLoading = false;
  dailyAttempted = false;
  search = '';
  gameStatus = '';

  constructor( private dialog: Dialog) {}

  ngOnInit() {
  }

  showGuideModal(): void{
    let guideModalRef = this.dialog.open(GuideComponent);
  }

  showLeaderboardModal(){
    let leaderboardModalRef = this.dialog.open(LeaderboardComponent);
  }

  showReportABugModal(){
    let reportABugModalRef = this.dialog.open(ReportABugComponent);
  }
}
