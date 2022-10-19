import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.getAccessToken().pipe(
            switchMap(accessToken => this.makeRequest(req, next, accessToken)),
            catchError(error => this.handleAuthError(req, next, error))
        );
    }

    private handleAuthError(req: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse): Observable<any> {
        if (error.status !== 401) {
            return throwError(() => error);
        }

        return this.authService.refreshOrGetGuestTokens().pipe(
            switchMap(response => this.makeRequest(req, next, response.accessToken))
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