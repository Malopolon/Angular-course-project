import { Actions, ofType, createEffect } from '@ngrx/effects'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import * as AuthActions from './auth.actions'
import { of } from 'rxjs'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

interface AuthResponseData {
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
    registered?: boolean
}
@Injectable()
export class AuthEffects {

    authLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) => {
                return this.http.post<AuthResponseData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB3q-4WCwlzshU3ptKTUR80OKfuXGeG74o',
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }
                ).pipe(
                    map(resData => {
                        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000)

                        return new AuthActions.Login({
                            email: resData.email,
                            userId: resData.localId,
                            token: resData.idToken,
                            expirationData: expirationDate
                        })
                    }),
                    catchError(errorRes => {
                        let errorMessage = 'An error eccurred!'
                        if (!errorRes.error || !errorRes.error.error) {
                            return of(new AuthActions.LoginFail(errorMessage))
                        }
                        switch (errorRes.error.error.message) {
                            case 'EMAIL_EXISTS':
                                errorMessage = 'The email address is already in use by another account.'
                                break;

                            case 'EMAIL_NOT_FOUND':
                                errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.'
                                break;

                            case 'INVALID_PASSWORD':
                                errorMessage = 'The password is invalid or the user does not have a password.'
                                break;
                        }
                        return of(new AuthActions.LoginFail(errorMessage))
                    })
                )
            })
        )
    })

    authSucces$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => this.router.navigate(['/']))
    ), { dispatch: false })

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
    ) { }

}

