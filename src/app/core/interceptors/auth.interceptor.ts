import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const _authService = inject(AuthService);
    const accessToken = _authService.getAccessToken();
    let authReq = req;

    if (accessToken) {
        authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
        });
    }

    return next(authReq).pipe(
        catchError(err => {
            if (err.status === 401 && !authReq.url.endsWith('/login') && !authReq.url.endsWith('/refreshtoken')) {
                return _authService.refreshToken().pipe(
                    switchMap(() => {
                        const newAuthToken = _authService.getAccessToken();
                        const newAuthReq = req.clone({
                            headers: req.headers.set('Authorization', `Bearer ${newAuthToken}`)
                        });
                        return next(newAuthReq);
                    }),
                    catchError((error) => {
                        _authService.logout();
                        return throwError(() => error);
                    })
                )
            }
            return throwError(() => err);
        })
    )
};