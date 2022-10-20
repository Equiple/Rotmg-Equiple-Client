import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

export const IGNORE_401 = new HttpContextToken(() => false);

interface HandleAuthErrorOptions {
    refreshToken?: boolean
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.makeRequest(req, next, null).pipe(
            catchError(error => this.handleAuthError(req, next, error))
        );
    }

    private handleAuthError(
        req: HttpRequest<any>,
        next: HttpHandler,
        error: HttpErrorResponse,
        options?: HandleAuthErrorOptions
    ): Observable<any> {
        if (error.status !== 401 || req.context.get(IGNORE_401)) {
            return throwError(() => error);
        }

        let $accessToken: Observable<string | null>;
        const refreshingToken = !!options?.refreshToken;
        if (refreshingToken) {
            $accessToken = this.authService.refreshOrGetGuestTokens().pipe(
                map(response => response.accessToken)
            );
        } else {
            $accessToken = this.authService.getAccessToken();
        }

        return $accessToken.pipe(
            switchMap(accessToken => this.makeRequest(req, next, accessToken)),
            catchError(error => {
                if (refreshingToken) {
                    return throwError(() => error);
                }
                return this.handleAuthError(req, next, error, { refreshToken: true })
            })
        );
    }

    private makeRequest(req: HttpRequest<any>, next: HttpHandler, accessToken: string | null): Observable<HttpEvent<any>> {
        if (accessToken) {
            req = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
        }
        return next.handle(req);
    }
}