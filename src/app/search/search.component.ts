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
  search = '';
  @Output() searchChanged = new EventEmitter<string>();
  searchDisabled = false;
  @Input() excludeReskins: boolean | undefined;
  @Input() set disabled(value: boolean){
    //
  };

  constructor(private gameService: GameService) { 
  }

  ngOnInit(): void {
  }

  onSearchbarChanged(){
    this.searchChanged.emit(this.search);
  }
}
