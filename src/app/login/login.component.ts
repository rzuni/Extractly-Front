import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ILoginResponse } from '../interfaces';
import {FormsModule} from "@angular/forms"; // <-- Importa la interfaz

declare const google: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: true,
    imports: [
        FormsModule
    ],
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    email = '';
    password = '';

    constructor(
        private router: Router,
        private ngZone: NgZone,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        google.accounts.id.initialize({
            client_id: '418023240864-ab1snvb3loio7dllf4pnc1l2hagv72ep.apps.googleusercontent.com\n',
            callback: (response: any) => this.handleGoogleCredentialResponse(response)
        });

        google.accounts.id.renderButton(
            document.getElementById('google-button'),
            { theme: 'outline', size: 'large', type: 'standard' }
        );
    }

    loginNormal(): void {
        this.authService.loginWithEmailAndPassword(this.email, this.password)
            .subscribe(
                (response: ILoginResponse) => { // <-- Corrige el tipo aquí
                    console.log('Inicio de sesión normal exitoso:', response);
                    localStorage.setItem('jwtToken', response.token);
                    this.router.navigate(['/dashboard']);
                },
                (error) => {
                    console.error('Error en el inicio de sesión normal:', error);
                }
            );
    }

    handleGoogleCredentialResponse(response: any): void {
        this.ngZone.run(() => {
            const idToken = response.credential;
            this.authService.sendGoogleTokenToBackend(idToken)
                .subscribe(
                    (backendResponse: ILoginResponse) => { // <-- Corrige el tipo aquí
                        console.log('Inicio de sesión con Google exitoso:', backendResponse);
                        localStorage.setItem('jwtToken', backendResponse.token);
                        this.router.navigate(['/dashboard']);
                    },
                    (error) => {
                        console.error('Error al iniciar sesión con Google:', error);
                    }
                );
        });
    }
}