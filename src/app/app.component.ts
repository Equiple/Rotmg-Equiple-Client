import { Component, InjectionToken, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GuessStatus, Item, Hints, Hint, Gamemode } from 'src/lib/api';
import { GameLogComponent } from './game-log/game-log.component';
import { GameService } from './services/game-service';
import { GuessResult } from 'src/lib/api';
import { forkJoin, of, Subscription, switchMap } from 'rxjs';
import { ModalService } from './services/modal-service';
import { GuideComponent } from './guide/guide.component';
import {Dialog, DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  guesses = new Array<Item>();
  hints = new Array<Hints>();
  gamemode = Gamemode.Daily;
  gameEnded = false;
  excludeReskins = false;
  changeAllowed = true;
  guessLoading = false;
  search = '';
  gameStatus = '';
  private readonly playerId = '6320750b6835566b454b114b';

  constructor(private gameService: GameService, private modalService: ModalService, public dialog: Dialog) {
  }

  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;

  get searchDisabled() {
    return this.gameEnded || this.guessLoading;
  }

  ngOnInit() {
    this.gameService.getActiveGameOptions(this.playerId).subscribe(activeGameOptions => {
      if (activeGameOptions) {
        this.gameService.getGuesses(this.playerId).subscribe(guesses => this.guesses = guesses);
        this.gameService.getAllHints(this.playerId).subscribe(hints => this.hints = hints);
        this.gamemode = activeGameOptions.mode!;
        this.excludeReskins = activeGameOptions.reskinsExcluded!;
        this.changeAllowed = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  debugWin(){
    this.createGameResultsModal('You have guessed the item with 4 tries!',
    'Your current streak in normal mode: 6',
    'bg-success',
    'https://i.imgur.com/o6cRNmb.gif'
    );
  }

  debugLeaderboard(){
    let leaderboardRef = this.dialog.open(LeaderboardComponent);
    leaderboardRef.closed.subscribe( () => {} );
  }

  summonGuide(): void{
    let dialogRef = this.dialog.open(GuideComponent);
    dialogRef.closed.subscribe( () => {} );
  }

  createGamemodeSwitchModal(activeGamemode: string, newGamemode: string) {
    this.sub = this.modalService.openModal(this.entry,
      `You have an active game in ${activeGamemode}!`,
      `Do you want to start a new ${newGamemode.toLowerCase()} game? Doing so will count as a lose and your current streak in ${activeGamemode.toLowerCase()} will be reset!`,
      'bg-danger', '').subscribe(result => {
        if (result === 'confirm') {
          this.gameService.closeTheGame(this.playerId);
        }
      });
  }

  createGameResultsModal(title: string, body: string, bgColor: string, imgLink: string){
    this.sub = this.modalService.openModal(this.entry, title, body, bgColor, imgLink).subscribe(result => {});
  }

  restartGame() {
    this.gameEnded = false;
    this.guesses = [];
    this.hints = [];
    this.changeAllowed = true;
  }

  isGamemode(gamemode: Gamemode) {
    return this.gamemode === gamemode;
  }

  setGamemode(gamemode: Gamemode) {
    this.gameService.getActiveGameOptions(this.playerId).subscribe(activeGameOptions => {
      if (!activeGameOptions) {
        this.gamemode = gamemode;
      }
      else if (gamemode !== activeGameOptions.mode) {
        this.createGamemodeSwitchModal(activeGameOptions.mode!, gamemode);
      }
    });
  }

  onCheckboxChange(value: boolean) {
    this.excludeReskins = value;
  }

  onSearchChanged(search: string){
    this.search = search;
  }

  onItemSelected(itemId: string) {
    this.guessLoading = true;
    this.gameService.checkGuess(itemId, this.playerId, this.gamemode, this.excludeReskins).pipe(
      switchMap(result => forkJoin([
        of(result),
        this.gameService.getGuess(itemId),
        this.gameService.getTries(this.playerId),
        this.gameService.getHints(this.playerId, itemId)
      ]))
    ).subscribe(([result, guess, tries, hints]) => {
      this.guesses.push(guess);
      this.hints.push(hints);
      if (result.status === GuessStatus.Guessed) {
        this.createGameResultsModal(`You\'ve guessed the ${guess.name} with ${tries} tries!`,
        `Your current streak in ${this.gamemode} is {streakNumber}`,
        'bg-success',
        'https://i.imgur.com/d7nl7uS.png');
        this.gameEnded = true;
        this.gameStatus = result.status;
      }
      else if (result.status === GuessStatus.Lost) {
        this.createGameResultsModal('You couldn\'t guess the item :C',
        'Very sad!',
        'bg-danger',
        'https://i.imgur.com/d7nl7uS.png');
        this.gameEnded = true;
      }
      this.guessLoading = false;
    });
  }
}
