import { Component, InjectionToken, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GuessStatus, Item, Hints, Hint, Gamemode } from 'src/lib/api';
import { ResultsComponent } from './results/results.component';
import { GameService } from './services/game-service';
import { GuessResult } from 'src/lib/api';
import { forkJoin, of, switchMap } from 'rxjs';


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
  guessLoading = false;
  readonly playerId = '6320750b6835566b454b114b';

  constructor(private gameService: GameService){

  }

  get searchDisabled(){
    return this.gameEnded || this.guessLoading;
  }

  ngOnInit(){
    this.gameService.getActiveGamemode(this.playerId).subscribe(activeGamemode => {
      if(activeGamemode){
        this.gameService.getGuesses(this.playerId).subscribe(guesses => this.guesses = guesses);
        this.gameService.getAllHints(this.playerId).subscribe(hints => this.hints = hints);
        this.gamemode = activeGamemode;
      }
    });
  }

  restartGame(){
    this.gameEnded = false;
    this.guesses = [];
    this.hints = [];
  }

  isGamemode(gamemode: string){
    return this.gamemode == gamemode;
  }

  setGamemode(gamemode: Gamemode){
    this.gameService.getActiveGamemode(this.playerId).subscribe(activeGamemode => {
      if(!activeGamemode){
        this.gamemode = gamemode;
      }
      else if(gamemode != activeGamemode){
        alert(`You have an active game in ${activeGamemode}! \nDo you want to start a new ${gamemode} game????`);
      } //TODO: Window with Yes/No selection.
    });
  }

  onItemSelected(itemId: string){
    this.guessLoading = true;
    this.gameService.checkGuess(itemId, this.playerId, this.gamemode).pipe(
      switchMap(result => forkJoin([
        of(result),
        this.gameService.getGuess(itemId),
        this.gameService.getTries(this.playerId),
        this.gameService.getHints(this.playerId, itemId)
      ]))
    ).subscribe(([result, guess, tries, hints])=>{ 
      this.guesses.push(guess);
      this.hints.push(hints);
      if(result.status === GuessStatus.Guessed){
        alert(`You've guessed ${guess.name} with ${tries} tries!`);
        this.gameEnded = true;
      }
      else if (result.status === GuessStatus.Lost){
        alert(`You couldn't guess the ${result.targetItem?.name} :C`);
        //TODO: Return target item name with GuessResult
        this.gameEnded = true;
      }
      this.guessLoading = false;
    });
  }
}
