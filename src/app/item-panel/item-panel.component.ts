import { Component, Input, OnInit } from '@angular/core';
import { Hint, Hints, Item } from 'src/lib/api';
import { GuessField } from '../GuessField';
import { ColorService } from '../services/color.service';

@Component({
    selector: 'app-item-panel',
    templateUrl: './item-panel.component.html',
    styleUrls: ['./item-panel.component.css']
})
export class ItemPanelComponent implements OnInit {
    @Input() public item: Item = undefined!;
    @Input() public hints?: Hints;
    @Input() public showHints: boolean = false;
    @Input() public itemNumber: number = 0;
    @Input() public itemIndex: number = 0;
    @Input() public status: string = '';
    readonly itemFields: GuessField[] = [
        { key: 'tier', title: 'Tier', icon: 'star-fill' },
        { key: 'type', title: 'Item Type', icon: 'asterisk' },
        { key: 'colorPalette', title: 'Palette', icon: 'palette-fill' },
        { key: 'xpBonus', title: 'XP Bonus', icon: 'lightning-fill' },
        { key: 'feedpower', title: 'Feedpower', icon: 'trash-fill' }
    ];

    constructor(private colorService : ColorService) { 
    }

    ngOnInit(): void {
    }

    getHintArrow(param: keyof Item, index: number) {
        if(!this.showHints){
            return '';
        }
        let hint = this.hints!;
        if (!hint) {
            return;
        }
        param = param as keyof Hints;
        if (hint[param] === Hint.Greater) {
            return 'bi-caret-up';
        } else if (hint[param] === Hint.Less) {
            return 'bi-caret-down';
        }
        return '';
    }

    getElementBgColor(index: number): string {
        if (index === 0 && this.status === 'Guessed') {
            this.status = '';
            return 'bg-success';
        }
        return 'bg-grey';
    }

    getHintBackgroundStyle(param: keyof Item, index: number) {
        if(!this.showHints){
            return '#D3D4D5';
        }
        let hints = this.hints!;
        if (hints === undefined) {
            return;
        }
        param = param as keyof Hints;
        let hint = hints[param];
        if (hint === undefined || hint === null){
            return '#CC0000';
        }
        if (!Array.isArray(hint)){
            hint = [hint];
        }
        return hint.some(x => x === 'Correct') ? '#339900' : '#CC0000';
    }

    isCorrectColor(index: number){
        let hints = this.hints!;
        if (hints === undefined || hints === null){
            return false;
        }
        if(!(index in this.hints!.colorPalette!)){
            return false;
        }
        if (this.hints!.colorPalette![index] === Hint.Correct){
            return true;
        }
        return false;
    }

    getAdditionalClass(param: keyof Item, index: number) {
        let hint = this.hints!;
        if (!hint) {
            return;
        }
        param = param as keyof Hints;
        if (hint[param] === Hint.Correct) {
            return 'bg-success';
        }
        return 'bg-primary';
    }

    colorExists(index: number) {
        if (index in this.item.colorPalette!) {
            return true;
        }
        return false;
    }

    getBorderWidth(index: number) {
        const palette = this.item.colorPalette ?? [];
        if (!(index in palette)) {
            return `3px 0px 0px ${2 in palette ? '3px' : '0px'}`;
        }
        switch (index) {
            case 0: return '3px 0px 0px 3px';
            case 1: return '3px 3px 0px 0px';
            case 2: return '0px 0px 3px 3px';
            case 3: return '0px 3px 3px 0px';
            default: return '';
        }
    }

    getCheckmarkColor(index: number) {
        const color = this.getColor(index);
        const {r, g, b} = this.colorService.hexToRgb(color);
        return (r + g + b)/3 > 128 ? 'black' : 'white';
    }

    getTooltip() {
        let tooltip = 'Colors:   \n';
        this.item.colorPalette?.forEach(color => {
            tooltip += ` ${this.colorService.getColorName(color)},`;
        })
        return tooltip.slice(0, -1);
    }

    getColor(index: number) {
        if (!this.colorExists(index)) {
            return 'Transparent';
        }
        else return this.item.colorPalette![index];
    }

    getColorName(index: number) {
        if (!this.colorExists(index)) {
            return '';
        }
        let colorHex = this.item.colorPalette![index];
        return this.colorService.getColorName(colorHex);
    }
}
