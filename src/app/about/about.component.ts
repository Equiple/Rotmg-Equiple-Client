import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  readonly credits: string[][]= [
    ["https://www.realmeye.com/player/Norton", "Norton", "Development and organization"],
    ["https://www.realmeye.com/player/ThatsJake", "ThatsJake", "Additional code, game design and consulting"],
    ["https://www.nytimes.com/games/wordle/index.html", "'Wordle' by Josh Wardle", "Original idea and inspiration"],
    ["https://www.realmofthemadgod.com/", "Rotmg", "Base of the game, assets and information. (Please don't sue us)"],
    ["https://www.realmeye.com/wiki/realm-of-the-mad-god", "Realmeye wiki", "Item images and additional information"],
    ["https://hunters-journle.web.app/game", "'Hunter's journle' by NerfIrelia73", "More inspiration game and design study"],
    ["http://rotmgle.epizy.com/", "'Rotmgle' by NoxZet", "Game design study"],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
