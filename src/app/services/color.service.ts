import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    private colorMap: Map<string, string> = new Map<string, string>();

    constructor() {
        this.loadColorMap();
    }

    private loadColorMap() {
        const filePath = 'assets/Colors.txt';
        const rawFile = new XMLHttpRequest();
        rawFile.open('GET', filePath, false);
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4 && rawFile.status === 200) {
                const lines = rawFile.responseText.split('\n');
                lines.forEach(line => {
                    const [hex, colorName] = line.split(' ');
                    this.colorMap.set(hex.trim(), colorName.trim());
                });
            }
        };
        rawFile.send(null);
    }

    getColorName(hex: string): string {
        return this.colorMap.get(hex.toLowerCase())
            || this.colorMap.get(hex.toUpperCase())
            || 'Unknown Color';
    }

    hexToRgb(hex: string): { r: number, g: number, b: number } {
        if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            throw new Error('Bad Hex');
        }
        let hexParts = hex.substring(1).split('');
        if (hexParts.length == 3) {
            hexParts = [hexParts[0], hexParts[0], hexParts[1], hexParts[1], hexParts[2], hexParts[2]];
        }
        const hexNum = +('0x' + hexParts.join(''));
        return {
            r: (hexNum >> 16) & 255,
            b: (hexNum >> 8) & 255,
            g: hexNum & 255
        };
    }
}