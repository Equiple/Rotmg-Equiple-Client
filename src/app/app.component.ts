import { Component, OnInit } from '@angular/core';
import { Item, Hints, Gamemode } from 'src/lib/api';
import { GuideComponent } from './guide/guide.component';
import { Dialog } from '@angular/cdk/dialog';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';


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
  private readonly playerId = '63468622d01c82bd9efc0598';

  constructor( private dialog: Dialog) {}

  ngOnInit() {
  }

  toggleDarkTheme(){
    document.body.classList.toggle('dark-theme');
  }

  showGuideModal(): void{
    let guideModalRef = this.dialog.open(GuideComponent);
    guideModalRef.closed.subscribe( () => {} );
  }

  showLeaderboardModal(){
    let leaderboardModalRef = this.dialog.open(LeaderboardComponent);
    leaderboardModalRef.closed.subscribe( result => {} );
  }
}
