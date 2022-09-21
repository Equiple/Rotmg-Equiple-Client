import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  players : string[] = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", 
    "Player 6", "Player 7","Player 8","Player 9", "Player 10"];
  currentGamemode = "Daily";
  bgColor = "-primary";
  constructor(private dialogRef: DialogRef<string>) { }
  readonly playerPlaces = [
    {key: "0", color:"table-warning", icon:"star-fill"},
    {key: "1", color:"table-secondary", icon:"asterisk"},
    {key: "2", color:"table-primary", icon:"heart-arrow"}
  ];

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }

  getPlayerBgColor(index: number): string {
    if(index<3){
      return this.playerPlaces[index].color;
    }
    return "table-danger";
  }

  changeMode(gamemode: string){
    this.currentGamemode = gamemode;
    if(gamemode === "Daily"){
      this.bgColor="-primary"
    }else{
      this.bgColor="-info"
    }
    //get leaderboard for this gamemode
    //upload it to this.players
  }
}
