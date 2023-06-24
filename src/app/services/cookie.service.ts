import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {
    constructor() {

    }

    public setCookie(key: string, value: string, lifetimeDays: number) {
        const d = new Date();
        d.setTime(d.getTime() + (lifetimeDays * 24 * 60 * 60 * 1000));
        let expires = 'expires=' + d.toUTCString();
        document.cookie = key + '=' + value + ';' + expires + ';path=/';
    }

    public getCookie(key: string) {
        let name = key + "=";
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return '';
    }

    public doesCookieExist(key: string): boolean {
        if (this.getCookie(key) === '') {
            return false;
        }
        else return true;
    }
}