import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from 'src/lib/api';
import { GuessField } from '../GuessField';
import { GameService } from '../services/game-service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  items: Item[] = [];
  search = '';
  searchDisabled = false;
  readonly itemFields : GuessField[] = [
    {key: "tier", title:"Tier", icon:"star-fill"},
    {key: "type", title:"Item type", icon:"asterisk"},
    {key: "numberOfShots", title:"Shots", icon:"heart-arrow"},
    {key: "xpBonus", title:"XP Bonus", icon:"lightning-fill"},
    {key: "feedpower", title:"Feedpower", icon:"trash3"}
  ];
  
  @Input() set disabled(value: boolean){
    if (value) {
      this.search='';
      this.items=[];
    } else{
      this.updateItems();
    } 
    this.searchDisabled = value;
  };

  @Output() itemSelected = new EventEmitter<string>();

  constructor(private gameService: GameService) { 

  }

  onItemSelected(id: string){
    this.itemSelected.emit(id);
  }

  ngOnInit(): void {
    
  }

  updateItems(){
    this.gameService.findAll(this.search).subscribe(items => this.items = items);
  }

  onSearchbarChanged(){
    this.updateItems();
  }
}
