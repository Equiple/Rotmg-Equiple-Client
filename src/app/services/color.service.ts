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
    return this.colorMap.get(hex.toLowerCase()) || 'Unknown Color';
  }
}