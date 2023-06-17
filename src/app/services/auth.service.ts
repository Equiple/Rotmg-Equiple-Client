import { HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService, TokenAuthenticationResponse, TokenAuthenticationResultType } from "src/lib/api";
import { PASS_401 } from "../http-interceptors/auth.interceptor";
import { Observable, catchError, lastValueFrom, of, throwError } from "rxjs";
import { environment } from "src/environments/environment";

export type AuthResult = {
    status: 'okTokens';
    accessToken: string;
} | {
    status: 'okCookie';
} | {
    status: 'error';
};

const accessToken = 'access_token';
const refreshToken = 'refresh_token';

const context = new HttpContext().set(PASS_401, true);

function authRequest(request: Observable<TokenAuthenticationResponse>): Promise<TokenAuthenticationResponse> {
    return lastValueFrom(request.pipe(
        catchError(error => {
            if (error.status !== 401) {
                return throwError(() => error);
            }
            const errorResponse: TokenAuthenticationResponse = {
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

    public get authResultType(): TokenAuthenticationResultType {
        return environment.authResultType;
    }
    
    public get accessToken(): string | undefined {
        return this._accessToken;
    }

    public async authenticateGuest(): Promise<AuthResult> {
        const response = await lastValueFrom(
            this.authenticationService.authenticationAuthenticateGuestPost(this.authResultType)
        );
        const result = this.processResponse(response);
        return result;
    }

    public async refreshToken(): Promise<AuthResult> {
        if (this.authResultType !== 'Tokens' || !this._refreshToken) {
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
        if (this.authResultType === 'Tokens') {
            this.removeTokens();
        }
    }

    private processResponse(response: TokenAuthenticationResponse): AuthResult {
        switch (response.type) {
            case 'Tokens':
                return this.processTokensResponse(response);
            case 'Cookie':
                return this.processCookieResponse(response);
            default:
                return { status: 'error' };
        }
    }

    private processTokensResponse(response: TokenAuthenticationResponse): AuthResult {
        if (!response.isAuthenticated || !response.accessToken || !response.refreshToken) {
            this.removeTokens();
            return { status: 'error' };
        }
        this._accessToken = response.accessToken;
        this._refreshToken = response.refreshToken;
        localStorage.setItem(accessToken, this._accessToken);
        localStorage.setItem(refreshToken, this._refreshToken);
        return {
            status: 'okTokens',
            accessToken: this._accessToken,
        };
    }

    private processCookieResponse(response: TokenAuthenticationResponse): AuthResult {
        return { status: response.isAuthenticated ? 'okCookie' : 'error' };
    }

    private removeTokens(): void {
        this._accessToken = undefined;
        this._refreshToken = undefined;
        localStorage.removeItem(accessToken);
        localStorage.removeItem(refreshToken);
    }
}
