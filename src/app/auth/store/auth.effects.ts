import { Actions, ofType, createEffect } from '@ngrx/effects'
import { catchError, map, switchMap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import * as AuthActions from './auth.actions'
import { Observable, of } from 'rxjs'
import { Injectable } from '@angular/core'

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
                        return of(new AuthActions.Login({
                            email: resData.email,
                            userId: resData.localId,
                            token: resData.idToken,
                            expirationData: expirationDate
                        }))
                    }),
                    catchError(erroe => {
                        return of()
                    })
                )
            })
        )
    })


    // this.actions$.pipe(
    //     ofType(AuthActions.LOGIN_START),
    //     switchMap((authData: AuthActions.LoginStart) => this.http.post(
    //         'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB3q-4WCwlzshU3ptKTUR80OKfuXGeG74o',
    //         {
    //             email: authData.payload.email,
    //             password: authData.payload.password,
    //             returnSecureToken: true
    //         }
    //     )
    //         .pipe(
    //             map(resData  => {
    //                 const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    //                 return of(new AuthActions.Login({
    //                     email: resData.email,
    //                     userId: resData.localId,
    //                     token: resData.idToken,
    //                     expirationDate: expirationDate
    //                 }))
    //             }),
    //             catchError(error => {
    //                 return of()
    //             })
    //         )
    //     )
    // ))




    // this.actions$.pipe(
    //     ofType(AuthActions.LOGIN_START),
    //     switchMap((authData: AuthActions.LoginStart) => {
    //         return this.http.post<AuthResponseData>(
    //             'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB3q-4WCwlzshU3ptKTUR80OKfuXGeG74o',
    //             {
    //                 email: authData.payload.email,
    //                 password: authData.payload.password,
    //                 returnSecureToken: true
    //             }
    //         )
    //     })
    // )
    constructor(private actions$: Actions, private http: HttpClient) { }

}

