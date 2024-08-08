import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError, } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    private _http = inject(HttpClient);
    private _router = inject(Router);
    private api = environment.api;
    private tokenKey = 'accessToken';
    private refreshKey = 'refreshToken';

    login(form: any) {
        return this._http
            .post(this.api + 'auth/login', form)
            .pipe(
                tap((res: any) => {
                    localStorage.setItem(this.tokenKey, res.token);
                    localStorage.setItem(this.refreshKey, res.refreshToken);
                })
            );
    }

    logout(): void {
        localStorage.clear();
        this._router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem(this.tokenKey);
        return !token ? false : true;
    }

    refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            this.logout();
            return throwError('No refresh token available');
        }

        return this._http.post(
            this.api + 'auth/refreshtoken',
            { refreshToken: this.getRefreshToken() }).pipe(
                tap((response: any) => {
                    localStorage.setItem(this.tokenKey, response.token);
                    localStorage.setItem(this.refreshKey, response.refreshToken);
                }),
                catchError(error => {
                    this.logout();
                    return throwError(() => error);
                })
            );
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshKey);
    }
}