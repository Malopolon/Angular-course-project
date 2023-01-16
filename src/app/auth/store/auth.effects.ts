import { Actions, ofType } from '@ngrx/effects'
import { switchMap } from 'rxjs/operators'
import * as AuthActions from './auth.actions'
export class AuthEffects {

    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart))
    )
    constructor(private actions$: Actions) { }

}