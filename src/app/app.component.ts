import { Component, InjectionToken, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GuessStatus, Item, Hints, Hint } from 'src/lib/api';
import { ResultsComponent } from './results/results.component';
import { GameService } from './services/game-service';
import { GuessResult } from 'src/lib/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  guesses = new Array<Item>();
  hints = new Array<Hints>();
  gameEnded = false;
  readonly playerId = "631b37496deb226ba814beb0";

  constructor(private gameService: GameService){

  }

  ngOnInit(){
    this.startGame();
  }

  startGame(){
    this.gameEnded = false;
    this.guesses = [];
  }

  onItemSelected(itemId: string){
    let result: GuessResult;
    this.gameService.checkGuess(itemId, this.playerId).subscribe(guessResult => result = guessResult);
    let item: Item;
    this.gameService.getGuess(itemId).subscribe(guess => item = guess);
    this.guesses.push(item!);
    let tries;
    this.gameService.getTries(itemId).subscribe(playerTries => tries = playerTries);
    this.gameService.getHints(this.playerId, itemId).subscribe(hints => this.hints.push(hints));
    if(result!.status === GuessStatus.Guessed){
      alert(`You've guessed ${item!.name} with ${tries} tries!`);
      this.gameEnded = true;
    }else if(tries === 10){
      let targetItem : string;
      this.gameService.getTargetItemName(this.playerId).subscribe(item => targetItem = item);
      alert(`You ran out of tries! :(\nThe item was: ${targetItem!}`);
      this.gameEnded = true;
    }
  }
}
