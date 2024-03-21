import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../../core/models/user';
import { AuthenticationService } from '../../core/services/authentication.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthenticationService
    ) {}

    authLogin = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.LoginStart),
            switchMap((loginData) => {
                return this.authService
                    .login(loginData.payload.email, loginData.payload.password)
                    .pipe(
                        tap((respound: User) => {
                            console.log('respound', respound);
                        }),
                        map((response: User) => {
                            const user = new User(
                                response.idToken,
                                response.email,
                                response.refreshToken,
                                response.expiresIn,
                                response.localId,
                                response.registered
                            );
                            localStorage.setItem(
                                'userData',
                                JSON.stringify(user)
                            );
                            return AuthActions.AuthenticateSuccess({
                                payload: user,
                            });
                        }),
                        catchError((error) => {
                            return of(
                                AuthActions.AuthenticateFail({
                                    payload: error.error.error.message,
                                })
                            );
                        })
                    );
            })
        )
    );

    logout = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(AuthActions.Logout),
                tap(() => {
                    localStorage.removeItem('userData');
                })
            );
        },
        { dispatch: false }
    );
}
