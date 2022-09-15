import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of, Subject, switchMap } from 'rxjs';
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
  @Input() excludeReskins: boolean | undefined;
  readonly itemFields : GuessField[] = [
    {key: "tier", title:"Tier", icon:"star-fill"},
    {key: "type", title:"Item type", icon:"asterisk"},
    {key: "numberOfShots", title:"Shots", icon:"heart-arrow"},
    {key: "xpBonus", title:"XP Bonus", icon:"lightning-fill"},
    {key: "feedpower", title:"Feedpower", icon:"trash3"}
  ];
  private itemsRequest = new Subject();
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
    this.itemsRequest.pipe(switchMap(() => {
      if (!this.search) {
        return of([]);
      }
      return this.gameService.findAll(this.search, this.excludeReskins!);
    })).subscribe(items => {
      this.items = items;
    });
  }

  updateItems(){
    this.itemsRequest.next(0);
  }

  onSearchbarChanged(){
    this.updateItems();
  }
}
