import { HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationResponse, AuthenticationService } from "src/lib/api";
import { PASS_401 } from "../http-interceptors/auth.interceptor";
import { Observable, catchError, lastValueFrom, of, throwError } from "rxjs";

export type AuthResult = {
    status: 'ok';
    accessToken: string;
} | {
    status: 'error';
}

const accessToken = 'access_token';
const refreshToken = 'refresh_token';

const context = new HttpContext().set(PASS_401, true);

function authRequest(request: Observable<AuthenticationResponse>): Promise<AuthenticationResponse> {
    return lastValueFrom(request.pipe(
        catchError(error => {
            if (error.status !== 401) {
                return throwError(() => error);
            }
            const errorResponse: AuthenticationResponse = {
                isAuthenticated: false,
            };
            return of(errorResponse);
        })
    ));
}

@Injectable()
export class AuthService {
    private _accessToken?: string;
    private _refreshToken?: string;

    constructor(private authenticationService: AuthenticationService) {
        this._accessToken = localStorage.getItem(accessToken) || undefined;
        this._refreshToken = localStorage.getItem(refreshToken) || undefined;
    }
    
    public get accessToken(): string | undefined {
        return this._accessToken;
    }

    public async authenticateGuest(): Promise<AuthResult> {
        const response = await lastValueFrom(
            this.authenticationService.authenticationAuthenticateGuestPost()
        );
        const result = this.processResponse(response);
        return result;
    }

    public async refreshToken(): Promise<AuthResult> {
        if (!this._refreshToken) {
            return { status: 'error' };
        }
        const response = await authRequest(
            this.authenticationService.authenticationRefreshAccessTokenPost(this._refreshToken, 'body', false, { context })
        );
        const result = this.processResponse(response);
        return result;
    }

    public async logout(): Promise<any> {
        await lastValueFrom(
            this.authenticationService.authenticationLogoutPost('body', false, { context })
        );
        this.removeTokens();
    }

    private processResponse(response: AuthenticationResponse): AuthResult {
        if (!response.isAuthenticated || !response.accessToken || !response.refreshToken) {
            this.removeTokens();
            return { status: 'error' };
        }
        this._accessToken = response.accessToken;
        this._refreshToken = response.refreshToken;
        localStorage.setItem(accessToken, this._accessToken);
        localStorage.setItem(refreshToken, this._refreshToken);
        return {
            status: 'ok',
            accessToken: this._accessToken,
        };
    }

    private removeTokens(): void {
        this._accessToken = undefined;
        this._refreshToken = undefined;
        localStorage.removeItem(accessToken);
        localStorage.removeItem(refreshToken);
    }
}
