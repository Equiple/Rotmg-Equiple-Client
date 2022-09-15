import { Component, Input, OnInit } from '@angular/core';
import { Hint, Hints, Item } from 'src/lib/api';
import { GuessField } from '../GuessField'
import { GameService } from '../services/game-service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  readonly playerId = '6320750b6835566b454b114b';
  @Input() hints = new Array<Hints>();
  @Input() guesses = new Array<Item>();
  readonly guessFields : GuessField[] = [
    {key: "tier", title:"Tier", icon:"star-fill"},
    {key: "type", title:"Item type", icon:"asterisk"},
    {key: "numberOfShots", title:"Shots", icon:"heart-arrow"},
    {key: "xpBonus", title:"XP Bonus", icon:"lightning-fill"},
    {key: "feedpower", title:"Feedpower", icon:"trash3"}
  ];

  constructor(private gameService: GameService) { 

  }

  ngOnInit(): void {
    
  }

  getAdditionalClass(param: keyof Item, index: number){
    let hint = this.hints[index];
    if(hint === undefined) return;
    param = param as keyof Hints;
    if(hint[param] === Hint.Correct){
      return 'bg-success';
    }
    return 'bg-danger';
  }

  getHintArrow(param: keyof Item, index: number){
    let hint = this.hints[index];
    if(hint === undefined) return;
    param = param as keyof Hints;
    if(hint[param] === Hint.Greater){
      return 'bi-caret-up';
    }else if(hint[param] === Hint.Less){
      return 'bi-caret-down';
    }
    return '';
  }
  
}
