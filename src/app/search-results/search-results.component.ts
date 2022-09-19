import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of, Subject, switchMap } from 'rxjs';
import { Item } from 'src/lib/api';
import { GameService } from '../services/game-service';
import { GuessField } from '../GuessField';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  @Input() set search(value: string) {
    this.searchInput = value;
    this.updateItems();
  };
  private searchInput = '';
  @Input() excludeReskins: boolean | undefined;
  items: Item[] = [];
  @Output() itemSelected = new EventEmitter<string>();
  private itemsRequest = new Subject();
  readonly itemFields : GuessField[] = [
    {key: "tier", title:"Tier", icon:"star-fill"},
    {key: "type", title:"Item type", icon:"asterisk"},
    {key: "numberOfShots", title:"Shots", icon:"heart-arrow"},
    {key: "xpBonus", title:"XP Bonus", icon:"lightning-fill"},
    {key: "feedpower", title:"Feedpower", icon:"trash3"}
  ];
  
  constructor(private gameService: GameService) { 
  }

  ngOnInit(): void {
    this.itemsRequest.pipe(switchMap(() => {
      if (!this.searchInput) {
        return of([]);
      }
      return this.gameService.findAll(this.searchInput, this.excludeReskins!);
    })).subscribe(items => {
      this.items = items;
    });
  }

  onItemSelected(id: string){
    this.itemSelected.emit(id);
  }

  updateItems(){
    this.itemsRequest.next(0);
  }
}
