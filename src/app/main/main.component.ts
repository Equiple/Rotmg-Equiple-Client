import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { Gamemode, GuessResult, GuessStatus, Hint, Hints, Item, PlayerProfile } from 'src/lib/api';
import { ModalComponent } from '../modal/modal.component';
import { GameService } from '../services/game.service';
import { ProfileService } from '../services/profile.service';
import { getPlayerStats } from '../utils/helperFunctions';
import { CookieService } from '../services/cookie.service';

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
    targetDescription = '???';
    colorblindMode: boolean = false;

    constructor(private gameService: GameService, 
        private profileService: ProfileService,
        private cookieService: CookieService,
        public dialog: Dialog) {
            if(cookieService.doesCookieExist('colorblind')){
                this.colorblindMode = cookieService.getCookie('colorblind') === 'true';
            }
    }

    get searchDisabled() {
        return this.gameEnded || this.guessLoading || (this.gamemode === Gamemode.Daily && this.dailyAttempted === true);
    }

    public getButtonClass(type :string) {
        if (this.colorblindMode) {
            return 'btn-outline-dark';
        }
        switch (type){
            case 'best': return 'btn-outline-warning';
            case 'current': return 'btn-outline-danger';
            case 'restart': return 'btn-outline-dark';
            case 'button Daily': return 'btn-danger';
            case 'button Normal': return 'btn-info';
            default: return 'btn-outline-dark';
        }
    }

    public get currentStreak() {
        if (this.playerProfile && getPlayerStats(this.playerProfile!, this.gamemode)) {
            return getPlayerStats(this.playerProfile!, this.gamemode)!.gameStatistic!.currentStreak;
        }
        else return 0;
    }

    public get bestStreak() {
        return 0;
    }

    public async updatePlayerProfile() {
        this.playerProfile = await this.profileService.getPlayerProfile();
    }

    public ngOnInit() {
        this.gameService.getActiveGameOptions().subscribe(activeGameOptions => {
            if (activeGameOptions) {
                this.guesses = activeGameOptions.guesses!;
                this.hints = activeGameOptions.allHints!;
                this.gamemode = activeGameOptions.mode!;
                this.targetDescription = activeGameOptions.description ?? '???';
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
                        modalImageLink: '',
                        secondButton: true,
                        secondButtonName: 'Confirm',
                        secondButtonResult: 'confirm'
                    }
                });
                gamemodeSwitchModalRef.closed.subscribe(result => {
                    if (result === 'confirm') {
                        this.excludeReskins = false;
                        this.gamemode = newGamemode;
                        this.gameService.closeTheGame().subscribe();
                        this.restartGame();
                    }
                })
            }
        })
    }

    public restartGame() {
        this.gameEnded = false;
        this.guesses = [];
        this.search = '';
        this.hints = [];
        this.targetDescription = '???';
        this.changeAllowed = true;
    }

    public isGamemode(gamemode: Gamemode) {
        return this.gamemode === gamemode;
    }

    public setGamemode(gamemode: Gamemode) {
        this.gameService.getActiveGameOptions().subscribe(activeGameOptions => {
            if (!activeGameOptions) {
                this.excludeReskins = false;
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

    public async onItemSelected(itemId: string) {
        if (this.playerProfile === null || this.playerProfile === undefined) {
            await this.updatePlayerProfile();
        }
        this.guessLoading = true;
        this.gameService.checkGuess(itemId, this.gamemode, this.excludeReskins)
            .subscribe(guessResult => {
                this.guesses.push(guessResult.guess!);
                this.hints.push(guessResult.hints!);
                this.targetDescription = guessResult.description ?? '???';
                let dialogRes: Observable<any>;
                if (guessResult.status === GuessStatus.Guessed) {
                    dialogRes = this.gameService.getCurrentStreak(this.gamemode).pipe(switchMap(streak => {
                        this.gameStatus = guessResult.status!;
                        this.search = '';
                        return this.dialog.open(ModalComponent, {
                            data: {
                                modalTitle: `You\'ve guessed the ${guessResult.targetItem?.name} with ${guessResult.tries} tries!`,
                                modalBody: `Your current streak in ${this.gamemode} is ${streak}`,
                                modalBgColor: 'bg-success',
                                modalImageLink: guessResult.targetItem?.imageURL ?? '',
                                secondButton: true,
                                secondButtonName: 'Share',
                                secondButtonResult: 'share'
                            }
                        }).closed;
                    }));
                    if (this.playerProfile!.role === 'guest') {
                        let dialogRes2 = this.dialog.open(ModalComponent, {
                            data: {
                                modalTitle: 'You\'re guest!',
                                modalBody: 'The game you just completed was recorded, but it appears you\'re not registered.\n Register now to save your game, change your name and be cool!',
                                modalBgColor: 'bg-warning',
                                modalImageLink: '',
                                secondButton: true,
                                secondButtonName: 'Register Now',
                                secondButtonResult: 'register'
                            }
                        }).closed;
                    }
                }
                else if (guessResult.status === GuessStatus.Lost) {
                    dialogRes = this.gameService.getTargetItem().pipe(switchMap(targetItem => {
                        return this.dialog.open(ModalComponent, {
                            data: {
                                modalTitle: `You couldn\'t guess the ${guessResult.targetItem?.name} :C`,
                                modalBody: 'Very were so close!',
                                modalBgColor: 'bg-danger',
                                modalImageLink: targetItem.imageURL!,
                                secondButton: false
                            }
                        }).closed;
                    }));
                }
                if (guessResult.status === GuessStatus.Guessed || guessResult.status === GuessStatus.Lost) {
                    dialogRes!.subscribe(async result => {
                        if (result === 'share') {
                            var resultBoxes = `Equiple `;
                            if (this.gamemode === 'Daily') {
                                var number = await this.gameService.getDailyNumber();
                                resultBoxes += `Daily#${number} `;
                            }
                            else {
                                resultBoxes += `Normal `;
                            }
                            resultBoxes += `${this.guesses.length}/10\n`;
                            this.hints.forEach(hint => {
                                resultBoxes += `${this.convertHintToBox(hint.tier!)}`
                                    + `${this.convertHintToBox(hint.type!)}`
                                    + `${this.convertHintToBox(hint.colorPalette!)}`
                                    + `${this.convertHintToBox(hint.xpBonus!)}`
                                    + `${this.convertHintToBox(hint.feedpower!)}\n`;
                            })
                            resultBoxes += 'https://equiple.net/'
                            navigator.clipboard.writeText(resultBoxes);
                        }
                        this.endGame(guessResult);
                        this.updatePlayerProfile();
                        this.disableDaily();
                    });
                }
                this.guessLoading = false;
            });
    }

    convertHintToBox(hint: Hint | Hint[]) {
        if (!Array.isArray(hint)) {
            hint = [hint];
        }
        return hint.some(x => x === 'Correct') ? '🟩' : '🟥';
    }
}
