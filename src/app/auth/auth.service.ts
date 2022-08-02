import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from 'rxjs'
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
    idToken: string	
    email: string	
    refreshToken: string	
    expiresIn: string
    localId: string
    registered?: boolean
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    user = new BehaviorSubject<User>(null)

    constructor(private http: HttpClient, private router: Router) {}

    signup(email: string, password: string, ) {
         return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB3q-4WCwlzshU3ptKTUR80OKfuXGeG74o',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError),
                tap( resData => {
                        this.handleAuthentication(
                            resData.email,
                            resData.localId,
                            resData.idToken,
                            +resData.expiresIn
                        )
                    }
                )
        )
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB3q-4WCwlzshU3ptKTUR80OKfuXGeG74o',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError),
                tap( resData => {
                        this.handleAuthentication(
                            resData.email,
                            resData.localId,
                            resData.idToken,
                            +resData.expiresIn
                        )
                    }
                )
        )
    }

    autologin () {
        const userData: {
            email : string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'))
        if(!userData) {
            return
        }
        const loadedUser = new User(
            userData.email, userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate))

        if(loadedUser.token) {
            this.user.next(loadedUser)
        }
    }

    logout() {
        this.user.next(null)
        this.router.navigate(['/auth'])
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An error eccurred!'
            if( !errorRes.error || !errorRes.error.error) {
                return throwError(errorMessage)
            } 
            switch( errorRes.error.error.message) {
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
            return throwError(errorMessage)
    }

    private handleAuthentication(
        email: string,
        userId: string, 
        token: string, 
        expiresIn: number
    ) {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn *1000 
        )
        const user = new User(
            email,
            userId, 
            token, 
            expirationDate
        )
        this.user.next(user)
        localStorage.setItem('userData', JSON.stringify(user))
    }
}