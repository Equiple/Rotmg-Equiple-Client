import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { forkJoin, of, switchMap } from 'rxjs';
import { Gamemode, GuessResult, GuessStatus, Hints, Item, PlayerProfile } from 'src/lib/api';
import { ModalComponent } from '../modal/modal.component';
import { GameService } from '../services/game-service';
import { ProfileService } from '../services/profile-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  playerProfile: PlayerProfile = {};
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

  constructor(private gameService: GameService, private profileService: ProfileService, public dialog: Dialog) {
  }

  get searchDisabled() {
    return this.gameEnded || this.guessLoading || (this.gamemode === Gamemode.Daily && this.dailyAttempted === true);
  }

  getCurrentStreak(){
    if(!this.playerProfile.dailyStats?.currentStreak){
      return 0;
    }
    if (this.gamemode === 'Daily'){
      return this.playerProfile.dailyStats!.currentStreak ?? 0;
    } else if (this.gamemode === 'Normal'){
      return this.playerProfile.normalStats!.currentStreak ?? 0;
    }
    else return 0;
  }

  getBestStreak(){
    if(!this.playerProfile.dailyStats?.bestStreak){
      return 0;
    }
    if (this.gamemode === 'Daily'){
      return this.playerProfile.dailyStats!.bestStreak ?? 0;
    } else if (this.gamemode === 'Normal'){
      return this.playerProfile.normalStats!.bestStreak ?? 0;
    }
    else return 0;
  }

  updatePlayerProfile(){
    this.profileService.getPlayerProfile(this.playerId).subscribe(profile => {
      if(profile){
        this.playerProfile = profile;
      }
    });
  }

  ngOnInit() {
    this.gameService.getActiveGameOptions(this.playerId).subscribe(activeGameOptions => {
      if (activeGameOptions) {
        this.gameService.getGuesses(this.playerId).subscribe(guesses => this.guesses = guesses);
        this.gameService.getAllHints(this.playerId).subscribe(hints => this.hints = hints);
        this.gamemode = activeGameOptions.mode!;
        this.excludeReskins = activeGameOptions.reskinsExcluded!;
        this.changeAllowed = false;
      } else {
        this.gameService.wasDailyAttempted(this.playerId).subscribe(dailyCheck => {
          if (dailyCheck){
            this.gamemode = Gamemode.Normal;
          }
          this.dailyAttempted = dailyCheck;
        });
      }
    });
    this.updatePlayerProfile();
  }

  createGamemodeSwitchModal(activeGamemode: string, newGamemode: string) {
    this.gameService.getCurrentStreak(this.playerId, this.gamemode).subscribe(streak =>{
      if (streak !== null){
        let gamemodeSwitchModalRef = this.dialog.open(ModalComponent, {
          data: { 
            modalTitle: `You have an active game in ${activeGamemode}!`, 
            modalBody: `Do you want to start a new ${newGamemode.toLowerCase()} game? Doing so will count as a lose 
                        and your current streak (${streak}) in ${activeGamemode.toLowerCase()} will be reset!`,
            modalBgColor: 'bg-danger', 
            modalImageLink: ''
          }
        });
        gamemodeSwitchModalRef.closed.subscribe(result => {
          if (result === "confirm"){
            this.gameService.closeTheGame(this.playerId);
          }
        })
      }
    })
  }

  createGameResultsModal(title: string, body: string, bgColor: string, imgLink: string){
    let dialogRef = this.dialog.open(ModalComponent, {
      data: { 
        modalTitle: title, 
        modalBody: body, 
        modalBgColor: bgColor, 
        modalImageLink: imgLink
      }
    });
    dialogRef.closed.subscribe( () => {});
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

  disableDaily(){
    if(this.gameEnded === true && this.gamemode === Gamemode.Daily){
      this.dailyAttempted = true;
    }
  }

  endGame(result: GuessResult) {
    this.gameEnded = true;
    this.gameStatus = result.status!.toString();
  }

  onItemSelected(itemId: string) {
    this.guessLoading = true;
    this.gameService.checkGuess(itemId, this.playerId, this.gamemode, this.excludeReskins).pipe(
      switchMap(result => forkJoin([
        of(result),
        this.gameService.getGuess(itemId),
        this.gameService.getTries(this.playerId),
        this.gameService.getHints(this.playerId, itemId),
        this.gameService.getCurrentStreak(this.playerId, this.gamemode)
      ]))
    ).subscribe(([result, guess, tries, hints, streak]) => {
      this.guesses.push(guess);
      this.hints.push(hints);
      
      if (result.status === GuessStatus.Guessed) {
        this.createGameResultsModal(`You\'ve guessed the ${guess.name} with ${tries} tries!`,
        `Your current streak in ${this.gamemode} is ${streak}`, 'bg-success', guess.imageURL ?? "");
        this.gameStatus = result.status;
        this.search = '';
      }
      else if (result.status === GuessStatus.Lost) {
        this.gameService.getTargetItemImage(this.playerId).subscribe(targetImage => {
          this.createGameResultsModal('You couldn\'t guess the item :C', 'Very sad!', 'bg-danger', targetImage);
        });
      }
      if (result.status === GuessStatus.Guessed || result.status === GuessStatus.Lost){
        this.endGame(result);
        this.updatePlayerProfile();
        this.disableDaily();
      }
      this.guessLoading = false;
    });
  }
}
