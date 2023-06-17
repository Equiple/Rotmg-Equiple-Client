import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, lastValueFrom, Observable, of, throwError } from "rxjs";
import { AuthResult, AuthService } from "../services/auth.service";

export const PASS_401 = new HttpContextToken(() => false);

function requestWithAuth(
    req: HttpRequest<any>,
    next: HttpHandler,
    accessToken: string | undefined
): Observable<HttpEvent<any>> {
    if (accessToken) {
        req = req.clone({
            setHeaders: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }
    return next.handle(req);
}

async function retry(
    req: HttpRequest<any>,
    next: HttpHandler,
    authFunc: () => Promise<AuthResult>
): Promise<HttpEvent<any> | undefined> {
    const authResult = await authFunc();
    if (authResult.status === 'error') {
        return undefined;
    }
    let accessToken: string | undefined;
    if (authResult.status === 'okTokens') {
        accessToken = authResult.accessToken;
    }
    return await lastValueFrom(
        requestWithAuth(req, next, accessToken).pipe(
            catchError(error => {
                if (error.status !== 401) {
                    return throwError(() => error);
                }
                return of(undefined);
            })
        )
    );
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private authErrorHandlingInProgress?: Promise<HttpEvent<any>>;

    constructor(private authService: AuthService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.makeRequest(req, next);
    }

    private makeRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return requestWithAuth(req, next, this.authService.accessToken).pipe(
            catchError(error => {
                if (error.status !== 401 || req.context.get(PASS_401)) {
                    return throwError(() => error);
                }
                return this.handleAuthErrorSafe(req, next);
            })
        );
    }

    private async handleAuthErrorSafe(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        if (this.authErrorHandlingInProgress) {
            await this.authErrorHandlingInProgress;
            return await lastValueFrom(
                this.makeRequest(req, next)
            );
        }
        this.authErrorHandlingInProgress = this.handleAuthError(req, next);
        try {
            return await this.authErrorHandlingInProgress;
        } catch (error) {
            throw error;
        } finally {
            this.authErrorHandlingInProgress = undefined;
        }
    }

    private async handleAuthError(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        let result = await retry(req, next, () => this.authService.refreshToken());
        if (result === undefined) {
            result = await retry(req, next, () => this.authService.authenticateGuest());
        }
        if (result === undefined) {
            throw new Error('Unable to refresh token or authenticate as guest');
        }
        return result;
    }
}
