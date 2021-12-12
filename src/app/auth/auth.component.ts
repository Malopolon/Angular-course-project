import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService, AuthResponseData } from "./auth.service";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})

export class AuthComponent {
    isLoginMode = true
    isLoading = false

    error:string = ''


    constructor(private authServise: AuthService, private router: Router) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit(form: NgForm) {
        if(!form.valid) {
            return;
        }
        const email = form.value.email
        const password = form.value.password
        this.isLoading = true
        let authObs: Observable<AuthResponseData>

        if(this.isLoginMode) {
           authObs =  this.authServise.login(email, password)
        } else {
           authObs = this.authServise.signup(email, password)
        }

        authObs.subscribe( 
            resData => {
                this.isLoading = false
                this.router.navigate(['/recipes'])
            },
            errorMessage => {
                this.error = errorMessage
                console.log(this.error)
                this.isLoading = false
            }
        )
        form.reset()
    }
}