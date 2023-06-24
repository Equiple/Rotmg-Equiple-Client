import { Component, Input, OnInit } from '@angular/core';
import { Hint, Hints, Item } from 'src/lib/api';
import { GuessField } from '../GuessField'
import { GameService } from '../services/game.service';
import { ColorService } from '../services/color.service';

@Component({
    selector: 'app-game-log',
    templateUrl: './game-log.component.html',
    styleUrls: ['./game-log.component.css']
})
export class GameLogComponent implements OnInit {
    @Input() colorblindMode: boolean = false;
    @Input() hints = new Array<Hints>();
    @Input() guesses = new Array<Item>();
    @Input() status = '';
    
    constructor(private gameService: GameService, private colorService: ColorService) {
    }

    ngOnInit(): void {
    }

    getElementBgColor(index: number): string {
        if (index === 0 && this.status === 'Guessed') {
            this.status = '';
            return 'bg-success';
        }
        return 'bg-grey';
    }
}
