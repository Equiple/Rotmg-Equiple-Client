import { Component, Input, OnInit } from '@angular/core';
import { Hint, Hints, Item } from 'src/lib/api';
import { GuessField } from '../GuessField'
import { GameService } from '../services/game-service';

@Component({
  selector: 'app-game-log',
  templateUrl: './game-log.component.html',
  styleUrls: ['./game-log.component.css']
})
export class GameLogComponent implements OnInit {
  readonly playerId = '6320750b6835566b454b114b';
  @Input() hints = new Array<Hints>();
  @Input() guesses = new Array<Item>();
  @Input() status = '';
  readonly guessFields : GuessField[] = [
    {key: "tier", title:"Tier", icon:"star-fill"},
    {key: "type", title:"Item type", icon:"asterisk"},
    //{key: "colorClass", title: "Color", icon: "palette-fill"},
    {key: "dominantColor", title: "Color", icon: "palette-fill"},
    //{key: "numberOfShots", title:"Shots", icon:"heart-arrow"},
    {key: "xpBonus", title:"XP Bonus", icon:"lightning-fill"},
    {key: "feedpower", title:"Feedpower", icon:"trash3"}
  ];

  constructor(private gameService: GameService) { 

  }

  ngOnInit(): void {
    
  }

  getElementBgColor(index: number): string{
    if(index === 0 && this.status === 'Guessed'){
      this.status = '';
      return 'bg-success';
    }
    return 'bg-light';
  }

  getHintBackgroundStyle(param: keyof Item, index: number){
    let hint = this.hints[index];
    if(hint === undefined){
      return;
    } 
    param = param as keyof Hints;
    if(param === 'dominantColor'){
      return hint[param];
    }
    else if(hint[param] === Hint.Correct){
      return "#339900";
    }
    return "#CC0000";
  }

  getAdditionalClass(param: keyof Item, index: number){
    let hint = this.hints[index];
    if(hint === undefined){
      return;
    } 
    param = param as keyof Hints;
    if(hint[param] === Hint.Correct){
      return 'bg-success';
    }
    return 'bg-primary';
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
