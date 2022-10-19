import { Injectable } from "@angular/core";
import { catchError, map, MonoTypeOperatorFunction, Observable, of, pipe, ReplaySubject, share, switchMap, tap, throwError } from "rxjs";
import { AuthenticationResponse, AuthenticationService } from "src/lib/api";

export interface RefreshResponse {
    accessToken: string
}

type AuthData = 'accessToken' | 'refreshToken' | 'deviceId';

const authDataStorageKeys: { [key in AuthData]: string } = {
    'accessToken': 'access_token',
    'refreshToken': 'refresh_token',
    'deviceId': 'device_id'
};

@Injectable()
export class AuthService {
    private readonly savedAuthData: { [key in AuthData]?: string | null } = {};

    private readonly $refreshOrGetGuestTokens: Observable<RefreshResponse> = of(true).pipe(
        this.warmUpAccessToken(),
        switchMap(() => {
            let request = this.authenticationService.authenticationAuthenticateGuestPost();
            const refreshToken = this.getAuthData('refreshToken');
            if (this.getAuthData('accessToken') && refreshToken) {
                request = this.authenticationService.authenticationRefreshAccessTokenPost(refreshToken).pipe(
                    switchMap(response => {
                        if (!response.isAuthenticated) {
                            return request;
                        }
                        return of(response);
                    })
                );
            }
            const response = request.pipe(
                this.processAuthData(),
                map(response => {
                    if (!response.isAuthenticated) {
                        throw new Error('somehow not authenticated');
                    }
                    const refreshResponse: RefreshResponse = {
                        accessToken: response.accessToken!
                    };
                    return refreshResponse;
                })
            );
            return response;
        }),
        share()
    );

    private accessTokenSubject?: ReplaySubject<string | null>;
    private $accessToken: Observable<string | null> = of(true).pipe(map(() => this.getAuthData('accessToken')));

    constructor(private authenticationService: AuthenticationService) { }

    public getAccessToken(): Observable<string | null> {
        return this.$accessToken;
    }
    
    public refreshOrGetGuestTokens(): Observable<RefreshResponse> {
        return this.$refreshOrGetGuestTokens;
    }

    private warmUpAccessToken<T>(): MonoTypeOperatorFunction<T> {
        return pipe(
            tap(() => {
                this.accessTokenSubject = new ReplaySubject(1);
                this.$accessToken = this.accessTokenSubject.asObservable();
            })
        );
    }

    private processAuthData(): MonoTypeOperatorFunction<AuthenticationResponse> {
        return pipe(
            tap(() => {
                if (!this.accessTokenSubject) {
                    throw new Error('warmUpAccessToken must be piped before processAuthData');
                }
            }),
            catchError(error => {
                this.accessTokenSubject?.error(error);
                return throwError(() => error);
            }),
            tap(response => {
                this.accessTokenSubject!.next(response.accessToken || null);

                this.saveAuthData('accessToken', response.accessToken || null);
                this.saveAuthData('refreshToken', response.refreshToken || null);
                this.saveAuthData('deviceId', response.deviceId || null);
            })
        );
    }

    private getAuthData(key: AuthData) {
        return this.savedAuthData[key] || (this.savedAuthData[key] = localStorage.getItem(authDataStorageKeys[key]));
    }

    private saveAuthData(key: AuthData, value: string | null) {
        this.savedAuthData[key] = value;
        const storageKey = authDataStorageKeys[key];
        if (value) {
            localStorage.setItem(storageKey, value);
        } else {
            localStorage.removeItem(storageKey);
        }
    }
}