import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { Gamemode, GuessResult, GuessStatus, Hints, Item, PlayerProfile } from 'src/lib/api';
import { ModalComponent } from '../modal/modal.component';
import { GameService } from '../services/game.service';
import { ProfileService } from '../services/profile.service';
import { getPlayerStats } from '../utils/helperFunctions';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    playerProfile?: PlayerProfile;
    guesses = new Array<Item>();
    hints = new Array<Hints>();
    gamemode = Gamemode.Daily;
    gameEnded = false;
    excludeReskins = false;
    changeAllowed = true;
    guessLoading = false;
    dailyAttempted = false;
    search = '';
    gameStatus = '';
    targetAnagram = '???';
    targetDescription = '???';

    constructor(private gameService: GameService, private profileService: ProfileService, public dialog: Dialog) {
    }

    get searchDisabled() {
        return this.gameEnded || this.guessLoading || (this.gamemode === Gamemode.Daily && this.dailyAttempted === true);
    }

    public get currentStreak() {
        return this.playerProfile ? getPlayerStats(this.playerProfile, this.gamemode).gameStatistic!.currentStreak! : 0;
    }

    public get bestStreak() {
        return this.playerProfile ? getPlayerStats(this.playerProfile, this.gamemode).gameStatistic!.currentStreak! : 0;
    }

    public updatePlayerProfile() {
        this.profileService.getPlayerProfile().subscribe(profile => {
            if (profile) {
                this.playerProfile = profile;
            }
        });
    }

    public ngOnInit() {
        this.gameService.getActiveGameOptions().subscribe(activeGameOptions => {
            if (activeGameOptions) {
                this.guesses = activeGameOptions.guesses!;
                this.hints = activeGameOptions.allHints!;
                this.gamemode = activeGameOptions.mode!;
                this.targetAnagram = activeGameOptions.anagram!;
                this.targetDescription = activeGameOptions.description!;
                this.excludeReskins = activeGameOptions.reskinsExcluded!;
                this.changeAllowed = false;
            } else {
                this.gameService.wasDailyAttempted().subscribe(dailyCheck => {
                    if (dailyCheck) {
                        this.gamemode = Gamemode.Normal;
                    }
                    this.dailyAttempted = dailyCheck;
                });
            }
        });
        this.updatePlayerProfile();
    }

    public createGamemodeSwitchModal(activeGamemode: Gamemode, newGamemode: Gamemode) {
        this.gameService.getCurrentStreak(this.gamemode).subscribe(streak => {
            if (streak !== null) {
                let gamemodeSwitchModalRef = this.dialog.open(ModalComponent, {
                    data: {
                        modalTitle: `You have an active game in ${activeGamemode}!`,
                        modalBody: `Do you want to start a new ${newGamemode.toLowerCase()} game? Doing so will count as a lose 
                        and your current streak (${streak}) in ${activeGamemode.toLowerCase()} will be reset!`,
                        modalBgColor: 'bg-danger',
                        modalImageLink: ''
                    }
                });
                gamemodeSwitchModalRef.closed.subscribe(result => {
                    if (result === "confirm") {
                        this.gameService.closeTheGame().subscribe();
                        this.restartGame();
                    }
                })
            }
        })
    }

    public createGameResultsModal(title: string, body: string, bgColor: string, imgLink: string) {
        const dialogRef = this.dialog.open(ModalComponent, {
            data: {
                modalTitle: title,
                modalBody: body,
                modalBgColor: bgColor,
                modalImageLink: imgLink
            }
        });
        return dialogRef.closed;
    }

    public restartGame() {
        this.gameEnded = false;
        this.guesses = [];
        this.search = "";
        this.hints = [];
        this.targetAnagram = '???';
        this.targetDescription = '???';
        this.changeAllowed = true;
    }

    public isGamemode(gamemode: Gamemode) {
        return this.gamemode === gamemode;
    }

    public setGamemode(gamemode: Gamemode) {
        this.gameService.getActiveGameOptions().subscribe(activeGameOptions => {
            if (!activeGameOptions) {
                this.gamemode = gamemode;
            }
            else if (gamemode !== activeGameOptions.mode) {
                this.createGamemodeSwitchModal(activeGameOptions.mode!, gamemode);
            }
        });
    }

    public onCheckboxChange(value: boolean) {
        this.excludeReskins = value;
    }

    public onSearchChanged(search: string) {
        this.search = search;
    }

    public disableDaily() {
        if (this.gameEnded === true && this.gamemode === Gamemode.Daily) {
            this.dailyAttempted = true;
        }
    }

    public endGame(result: GuessResult) {
        this.gameEnded = true;
        this.gameStatus = result.status!.toString();
    }

    public onItemSelected(itemId: string) {
        this.guessLoading = true;
        this.gameService.checkGuess(itemId, this.gamemode, this.excludeReskins)
            .subscribe(guessResult => {
                this.guesses.push(guessResult.guess!);
                this.hints.push(guessResult.hints!);
                if (guessResult.description && guessResult.anagram) {
                    this.targetAnagram = guessResult.anagram!;
                    this.targetDescription = guessResult.description!;
                }
                let dialogRes: Observable<any>;
                if (guessResult.status === GuessStatus.Guessed) {
                    dialogRes = this.gameService.getCurrentStreak(this.gamemode).pipe(switchMap(streak => {
                        this.gameStatus = guessResult.status!;
                        this.search = '';
                        return this.createGameResultsModal(`You\'ve guessed the ${guessResult.targetItem?.name} with ${guessResult.tries} tries!`,
                            `Your current streak in ${this.gamemode} is ${streak}`, 'bg-success', guessResult.targetItem?.imageURL ?? "");
                    }));
                }
                else if (guessResult.status === GuessStatus.Lost) {
                    dialogRes = this.gameService.getTargetItem().pipe(switchMap(targetItem => {
                        return this.createGameResultsModal('You couldn\'t guess the item :C', 'Very sad!', 'bg-danger', targetItem.imageURL!);
                    }));
                }
                if (guessResult.status === GuessStatus.Guessed || guessResult.status === GuessStatus.Lost) {
                    dialogRes!.subscribe(() => {
                        this.endGame(guessResult);
                        this.updatePlayerProfile();
                        this.disableDaily()
                    });
                }
                this.guessLoading = false;
            });
    }
}
