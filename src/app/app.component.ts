import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GuessStatus, Item, Hints, Gamemode } from 'src/lib/api';
import { GameService } from './services/game-service';
import { GuessResult } from 'src/lib/api';
import { forkJoin, of, switchMap } from 'rxjs';
import { GuideComponent } from './guide/guide.component';
import { Dialog } from '@angular/cdk/dialog';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ModalComponent } from './modal/modal.component';


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
  private readonly playerId = '6320750b6835566b454b114b';

  constructor( private dialog: Dialog) {
  }

  ngOnInit() {
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
